#!/bin/bash
# Safe migration script that only runs if database is available

set -e

echo "Installing dependencies..."
pip install -r requirements.txt

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL not set. Skipping migrations."
    echo "    The app will start but database operations will fail."
    echo "    Please set up a PostgreSQL database and configure DATABASE_URL."
    exit 0
fi

echo "DATABASE_URL is set. Running migrations..."

# Try to run migrations, but don't fail the build if it errors
if alembic upgrade head; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  WARNING: Migration failed. This might be expected if:"
    echo "    - Database doesn't exist yet"
    echo "    - Database is not accessible"
    echo "    - Migration revision mismatch"
    echo ""
    echo "    The app will still start, but you may need to fix migrations manually."
fi

exit 0
