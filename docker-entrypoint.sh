#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready - running migrations"

# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start the application
exec "$@"
