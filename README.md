# LGP CRM

A lean CRM system built for the **LegalShield Enrollment Specialist Team** — designed to manage leads through a 9-stage sales pipeline from initial contact to closed deal.

## Live URLs

| Service | URL |
|---|---|
| **Web** | https://lgp-crm-web-jqi3kmucmq-ue.a.run.app |
| **API** | https://lgp-crm-api-jqi3kmucmq-ue.a.run.app |

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS 10 · Prisma 5 · PostgreSQL (Cloud SQL) |
| Frontend | React 18 · Vite · Tailwind CSS |
| Auth | JWT (7-day tokens, bcrypt) |
| Infra | Google Cloud Run · Artifact Registry · Secret Manager |
| CI/CD | GitHub Actions → Docker → Cloud Run (< 10 min deploys) |

## Pipeline Stages

```
NEW → CONTACTED → CALL_BOOKED → CALL_COMPLETED → INTAKE_COMPLETED
→ PROPOSAL → NEGOTIATIONS → CONTRACT_AND_PAYMENT → CLOSED_WON
```

## Project Structure

```
├── apps/
│   ├── api/          # NestJS backend (Auth, Leads, Pipeline)
│   └── web/          # React frontend (Login, Kanban, Leads table)
├── Dockerfile.api    # Multi-stage API image (~150MB)
├── Dockerfile.web    # Multi-stage Web image (~30MB, nginx)
└── .github/
    └── workflows/
        └── cd-deploy-main.yaml   # Push to main → deploy to Cloud Run
```

## Local Development

```bash
# API
cd apps/api
cp .env.example .env   # Set DATABASE_URL and JWT_SECRET
npm install
npx prisma generate
npm run start:dev

# Web
cd apps/web
npm install
npm run dev
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET` | `/api/auth/me` | Current user (requires JWT) |
| `GET` | `/api/leads` | List all leads |
| `POST` | `/api/leads` | Create a lead |
| `PATCH` | `/api/leads/:id` | Update a lead |
| `DELETE` | `/api/leads/:id` | Delete a lead |
| `GET` | `/api/leads/pipeline` | Pipeline view (grouped by stage) |
| `GET` | `/api/healthz` | Health check |

## License

Proprietary — LGP Hub © 2026
