from django.contrib import admin
from django.urls import include, path, re_path

from .views import serve_frontend

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("registrations.urls")),
    re_path(r"^(?P<path>.*)$", serve_frontend, name="serve_frontend"),
]
