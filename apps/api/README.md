# LGP CRM API

NestJS backend for the LGP CRM system.

## Modules

- **AuthModule** — Register, login, JWT authentication (7-day tokens)
- **LeadsModule** — Full CRUD for leads + pipeline view (9 stages)
- **PrismaModule** — Global database service (PostgreSQL via Prisma 5)

## Running Locally

```bash
npm install
cp .env.example .env  # Set DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 3000) |
