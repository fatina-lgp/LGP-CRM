#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy 2>&1 || echo "⚠️  Migration skipped (DB may not be ready yet)"

echo "🚀 Starting NestJS server..."
exec node dist/main.js
