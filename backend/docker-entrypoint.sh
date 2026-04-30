#!/bin/bash
set -e

echo "Starting Django application..."

# Try to run migrations (they may fail if database is not ready, but that's okay for first boot)
echo "Attempting to run database migrations..."
python manage.py migrate --noinput 2>&1 || echo "⚠️  Migrations skipped (database may not be ready yet)"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || echo "⚠️  Static files collection skipped"

# Start gunicorn
echo "Starting gunicorn server on port ${PORT:-8000}..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3
