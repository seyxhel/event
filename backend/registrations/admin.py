from django.contrib import admin

from .models import EventRegistration


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
	list_display = ('last_name', 'first_name', 'company_name', 'email', 'will_come', 'attendee_count', 'created_at')
	search_fields = ('last_name', 'first_name', 'company_name', 'email')
