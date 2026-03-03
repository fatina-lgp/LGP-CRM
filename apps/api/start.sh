#!/bin/sh
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy 2>&1
MIGRATE_EXIT=$?
if [ $MIGRATE_EXIT -ne 0 ]; then
  echo "⚠️  Migration returned exit code $MIGRATE_EXIT — continuing anyway"
fi

echo "🚀 Starting NestJS server..."
exec node dist/main.js
