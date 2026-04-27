from django.contrib import admin
from django.urls import include, path, re_path

from .views import health_check, serve_frontend

urlpatterns = [
    path("api/health/", health_check, name="health_check"),
    path("admin/", admin.site.urls),
    path("", include("registrations.urls")),
    re_path(r"^(?P<path>.*)$", serve_frontend, name="serve_frontend"),
]
