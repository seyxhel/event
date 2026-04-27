FROM node:20-alpine AS frontend-builder
WORKDIR /workspace

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .
RUN set -eux; \
		if [ -f frontend/package.json ]; then \
			cd frontend && npm ci && npm run build && mkdir -p /artifacts/frontend_dist && cp -R dist/. /artifacts/frontend_dist/; \
		elif [ -f package.json ]; then \
			npm ci && npm run build && mkdir -p /artifacts/frontend_dist && cp -R dist/. /artifacts/frontend_dist/; \
		else \
			mkdir -p /artifacts/frontend_dist; \
		fi

FROM python:3.12-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY . /src
COPY --from=frontend-builder /artifacts /artifacts

RUN set -eux; \
		if [ -f /src/backend/requirements.txt ]; then \
			pip install --no-cache-dir -r /src/backend/requirements.txt; \
		elif [ -f /src/requirements.txt ]; then \
			pip install --no-cache-dir -r /src/requirements.txt; \
		fi; \
		if [ -f /src/backend/manage.py ]; then \
			mkdir -p /app/backend && cp -R /src/backend/. /app/backend/; \
		elif [ -f /src/manage.py ]; then \
			mkdir -p /app/backend && cp -R /src/. /app/backend/; \
		fi; \
		if [ -d /artifacts/frontend_dist ]; then \
			mkdir -p /app/frontend_dist && cp -R /artifacts/frontend_dist/. /app/frontend_dist/; \
		fi

EXPOSE 8000 8080

CMD ["sh", "-c", "if [ -f /app/backend/manage.py ]; then cd /app/backend && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3; elif [ -d /app/frontend_dist ]; then python -c 'import http.server, os, pathlib, socketserver; root = pathlib.Path(\"/app/frontend_dist\");\nclass Handler(http.server.SimpleHTTPRequestHandler):\n    def __init__(self, *args, **kwargs):\n        super().__init__(*args, directory=str(root), **kwargs)\n    def do_GET(self):\n        target = root / self.path.lstrip(\"/\")\n        if self.path == \"/\" or not target.exists() or target.is_dir():\n            self.path = \"/index.html\"\n        return super().do_GET()\nPORT = int(os.environ.get(\"PORT\", \"8080\"));\nwith socketserver.TCPServer((\"0.0.0.0\", PORT), Handler) as server:\n    server.serve_forever()'; else echo 'No runnable app found in build context' >&2; exit 1; fi"]
