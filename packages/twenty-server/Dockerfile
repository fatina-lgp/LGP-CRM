# ─── Stage 1: Build ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install OS deps required for native modules
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/twenty-server/package.json ./packages/twenty-server/
COPY packages/twenty-ui/package.json ./packages/twenty-ui/
COPY packages/twenty-shared/package.json ./packages/twenty-shared/
COPY packages/twenty-utils/package.json ./packages/twenty-utils/
COPY packages/twenty-emails/package.json ./packages/twenty-emails/
COPY packages/twenty-sdk/package.json ./packages/twenty-sdk/

# Install all dependencies
RUN yarn workspaces focus twenty-server --production=false

# Copy the full source
COPY . .

# Build the server
RUN yarn nx build twenty-server --skip-nx-cache

# ─── Stage 2: Production image ─────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

# Copy only what we need to run
COPY --from=builder /app/packages/twenty-server/dist ./packages/twenty-server/dist
COPY --from=builder /app/packages/twenty-server/package.json ./packages/twenty-server/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Cloud Run sets PORT env var; twenty-server respects PORT
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/healthz || exit 1

WORKDIR /app/packages/twenty-server
CMD ["node", "dist/main.js"]
