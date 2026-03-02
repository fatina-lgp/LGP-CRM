#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# LGP CRM — GCP Bootstrap Script
# Run this once to set up the entire GCP infrastructure.
# Usage: bash scripts/gcp-bootstrap.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ─── Config ──────────────────────────────────────────────────────────────────
PROJECT_ID="lgp-crm-prod"
REGION="us-east1"
GITHUB_REPO="fatina-lgp/LGP-CRM"
SA_NAME="github-actions-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
REGISTRY_REPO="lgp-crm"
SQL_INSTANCE="lgp-crm-db"
SQL_DB="lgp_crm"
SQL_USER="lgp_crm_user"
APP_SECRET=$(openssl rand -hex 32)

echo "╔══════════════════════════════════════════╗"
echo "║       LGP CRM — GCP Bootstrap           ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Project:  $PROJECT_ID"
echo "Region:   $REGION"
echo "GitHub:   $GITHUB_REPO"
echo ""

# ─── 1. Set project ───────────────────────────────────────────────────────────
echo "▶ Setting active project..."
gcloud config set project $PROJECT_ID

# ─── 2. Enable required APIs ─────────────────────────────────────────────────
echo "▶ Enabling APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com \
  compute.googleapis.com \
  --quiet

# ─── 3. Create Artifact Registry ─────────────────────────────────────────────
echo "▶ Creating Artifact Registry repository..."
gcloud artifacts repositories create $REGISTRY_REPO \
  --repository-format=docker \
  --location=$REGION \
  --description="LGP CRM Docker images" \
  --quiet || echo "  (repository already exists)"

# ─── 4. Create Cloud SQL instance ────────────────────────────────────────────
echo "▶ Creating Cloud SQL PostgreSQL instance (this takes ~5 mins)..."
gcloud sql instances create $SQL_INSTANCE \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --storage-auto-increase \
  --storage-size=10GB \
  --backup \
  --quiet || echo "  (instance already exists)"

# Generate a random DB password
SQL_PASSWORD=$(openssl rand -hex 20)

echo "▶ Creating database and user..."
gcloud sql databases create $SQL_DB --instance=$SQL_INSTANCE --quiet || echo "  (db already exists)"
gcloud sql users create $SQL_USER --instance=$SQL_INSTANCE --password="$SQL_PASSWORD" --quiet || echo "  (user already exists)"

# Get the Cloud SQL connection name
SQL_CONN=$(gcloud sql instances describe $SQL_INSTANCE --format='value(connectionName)')
PG_DATABASE_URL="postgresql://${SQL_USER}:${SQL_PASSWORD}@localhost/${SQL_DB}?host=/cloudsql/${SQL_CONN}"

# ─── 5. Create Service Account ───────────────────────────────────────────────
echo "▶ Creating service account $SA_NAME..."
gcloud iam service-accounts create $SA_NAME \
  --display-name="GitHub Actions SA for LGP CRM" \
  --quiet || echo "  (service account already exists)"

# ─── 6. Grant IAM roles ──────────────────────────────────────────────────────
echo "▶ Granting IAM roles..."
ROLES=(
  "roles/run.admin"
  "roles/artifactregistry.writer"
  "roles/cloudsql.client"
  "roles/secretmanager.secretAccessor"
  "roles/iam.serviceAccountTokenCreator"
  "roles/iam.serviceAccountUser"
)
for ROLE in "${ROLES[@]}"; do
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="$ROLE" \
    --quiet > /dev/null
done

# ─── 7. Set up Workload Identity Federation ───────────────────────────────────
echo "▶ Setting up Workload Identity Federation..."
POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-provider"

gcloud iam workload-identity-pools create $POOL_NAME \
  --location=global \
  --display-name="GitHub Actions Pool" \
  --quiet || echo "  (pool already exists)"

POOL_ID=$(gcloud iam workload-identity-pools describe $POOL_NAME \
  --location=global \
  --format='value(name)')

gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
  --workload-identity-pool=$POOL_NAME \
  --location=global \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor" \
  --attribute-condition="assertion.repository=='${GITHUB_REPO}'" \
  --quiet || echo "  (provider already exists)"

PROVIDER_NAME_FULL=$(gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
  --workload-identity-pool=$POOL_NAME \
  --location=global \
  --format='value(name)')

gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_REPO}" \
  --quiet > /dev/null

# ─── 8. Store secrets in Secret Manager ─────────────────────────────────────
echo "▶ Storing secrets in Secret Manager..."
store_secret() {
  local name=$1
  local value=$2
  echo -n "$value" | gcloud secrets create $name --data-file=- --replication-policy=automatic --quiet 2>/dev/null || \
  echo -n "$value" | gcloud secrets versions add $name --data-file=- --quiet
  echo "  Secret $name stored"
}

# These will be populated after Cloud Run is deployed (FRONTEND_URL updates after first deploy)
store_secret "PG_DATABASE_URL" "$PG_DATABASE_URL"
store_secret "APP_SECRET" "$APP_SECRET"
store_secret "FRONTEND_URL" "https://placeholder-update-after-first-deploy.run.app"

# ─── 9. Print GitHub Actions secrets ─────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║       Add these secrets to your GitHub repository:                  ║"
echo "║  Settings → Secrets and variables → Actions                         ║"
echo "╠══════════════════════════════════════════════════════════════════════╣"
echo "  GCP_PROJECT_ID           = $PROJECT_ID"
echo "  GCP_WORKLOAD_IDENTITY_PROVIDER = $PROVIDER_NAME_FULL"
echo "  GCP_SERVICE_ACCOUNT      = $SA_EMAIL"
echo "  CLOUD_SQL_INSTANCE       = $SQL_CONN"
echo "  SERVER_BASE_URL          = (update after first deploy — Cloud Run server URL)"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ GCP infrastructure bootstrapped successfully!"
echo "   Next: Add the secrets above to GitHub, then push to main to deploy."
