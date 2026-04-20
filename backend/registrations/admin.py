from django.contrib import admin

from .models import EventFeedback, EventRegistration


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
	list_display = ('last_name', 'first_name', 'company_name', 'email', 'will_come', 'attendee_count', 'created_at')
	search_fields = ('last_name', 'first_name', 'company_name', 'email')


@admin.register(EventFeedback)
class EventFeedbackAdmin(admin.ModelAdmin):
	list_display = ('id', 'personal_company_info_consent', 'event_satisfaction', 'job_relevance', 'created_at')
	search_fields = ('logistics_feedback', 'key_takeaways', 'overall_feedback', 'session_comments')
