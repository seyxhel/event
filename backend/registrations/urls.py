from django.urls import path

from .views import (
    export_feedback_xlsx,
    feedback_api,
    export_registrations_xlsx,
    manage_feedback_api,
    manage_registrations_api,
    register_api,
)

urlpatterns = [
    path('api/register/', register_api, name='register_api'),
    path('api/feedback/', feedback_api, name='feedback_api'),
    path('api/manage/registrations/', manage_registrations_api, name='manage_registrations_api'),
    path('api/manage/feedback/', manage_feedback_api, name='manage_feedback_api'),
    path('api/manage/export/xlsx/', export_registrations_xlsx, name='export_registrations_xlsx'),
    path('api/manage/export/feedback-xlsx/', export_feedback_xlsx, name='export_feedback_xlsx'),
]
