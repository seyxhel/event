import mimetypes
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound, JsonResponse
from django.views.decorators.http import require_GET


@require_GET
def health_check(request):
    return JsonResponse({"status": "ok"})


@require_GET
def serve_frontend(request, path: str = ""):
    frontend_dist_dir = Path(getattr(settings, "FRONTEND_DIST_DIR", ""))
    index_file = frontend_dist_dir / "index.html"

    if not frontend_dist_dir.exists() or not index_file.exists():
        return HttpResponseNotFound(
            "Frontend build not found. Run frontend build before serving from backend."
        )

    normalized_path = path.strip("/")
    requested_file = index_file if not normalized_path else frontend_dist_dir / normalized_path

    try:
        resolved_requested_file = requested_file.resolve()
        resolved_frontend_dir = frontend_dist_dir.resolve()
    except OSError:
        return HttpResponseNotFound("Not found")

    if resolved_frontend_dir != resolved_requested_file and resolved_frontend_dir not in resolved_requested_file.parents:
        return HttpResponseNotFound("Not found")

    if resolved_requested_file.is_file():
        content_type, content_encoding = mimetypes.guess_type(str(resolved_requested_file))
        response = FileResponse(
            open(resolved_requested_file, "rb"),
            content_type=content_type or "application/octet-stream",
        )
        if content_encoding:
            response["Content-Encoding"] = content_encoding

        if normalized_path.startswith("assets/"):
            response["Cache-Control"] = "public, max-age=31536000, immutable"
        else:
            response["Cache-Control"] = "no-cache"
        return response

    # Fallback for SPA client-side routes.
    response = FileResponse(open(index_file, "rb"), content_type="text/html; charset=utf-8")
    response["Cache-Control"] = "no-cache"
    return response
