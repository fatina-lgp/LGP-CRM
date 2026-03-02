# ─── Stage 1: Build ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++ git

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/twenty-front/package.json ./packages/twenty-front/
COPY packages/twenty-ui/package.json ./packages/twenty-ui/
COPY packages/twenty-shared/package.json ./packages/twenty-shared/
COPY packages/twenty-utils/package.json ./packages/twenty-utils/

RUN yarn workspaces focus twenty-front --production=false

COPY . .

# VITE_SERVER_BASE_URL is injected at build time via GitHub Actions secret
ARG VITE_SERVER_BASE_URL=http://localhost:3000
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL

RUN yarn nx build twenty-front --skip-nx-cache

# ─── Stage 2: Serve with nginx ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Copy built frontend
COPY --from=builder /app/packages/twenty-front/dist /usr/share/nginx/html

# Custom nginx config: serve SPA, proxy /api → backend
COPY packages/twenty-front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
