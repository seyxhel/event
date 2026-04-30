#!/bin/bash
set -e

echo "Starting Django application..."
echo "Django settings module: ${DJANGO_SETTINGS_MODULE:-config.settings}"

# Check if DATABASE_URL is set and log it (redacted for safety)
if [ -n "$DATABASE_URL" ]; then
	DB_HOST=$(echo "$DATABASE_URL" | grep -oP '(?<=@)[^/]+' || echo "unknown")
	echo "Database configured at: $DB_HOST"
else
	echo "⚠️  DATABASE_URL not set - using SQLite fallback"
fi

# Try to run migrations (they may fail if database is not ready, but that's okay for first boot)
echo "Attempting to run database migrations..."
python manage.py migrate --noinput 2>&1 || echo "⚠️  Migrations skipped (database connection or credentials may be invalid)"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || echo "⚠️  Static files collection skipped"

# Start gunicorn
echo "Starting gunicorn server on port ${PORT:-8000}..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3
