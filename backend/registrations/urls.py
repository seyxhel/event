from django.urls import path

from .views import (
    export_registrations_csv,
    export_registrations_pdf,
    manage_registrations_api,
    register_api,
)

urlpatterns = [
    path('api/register/', register_api, name='register_api'),
    path('api/manage/registrations/', manage_registrations_api, name='manage_registrations_api'),
    path('api/manage/export/csv/', export_registrations_csv, name='export_registrations_csv'),
    path('api/manage/export/pdf/', export_registrations_pdf, name='export_registrations_pdf'),
]
