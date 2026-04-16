from django.urls import path

from .views import (
    export_registrations_xlsx,
    manage_registrations_api,
    register_api,
)

urlpatterns = [
    path('api/register/', register_api, name='register_api'),
    path('api/manage/registrations/', manage_registrations_api, name='manage_registrations_api'),
    path('api/manage/export/xlsx/', export_registrations_xlsx, name='export_registrations_xlsx'),
]
