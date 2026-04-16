from django.db import models


class EventRegistration(models.Model):
	email = models.EmailField()
	last_name = models.CharField(max_length=100)
	first_name = models.CharField(max_length=100)
	middle_initial = models.CharField(max_length=2)
	designation = models.CharField(max_length=150)
	mobile_cp_no = models.CharField(max_length=30)
	viber_no = models.CharField(max_length=30)
	gcash_no = models.CharField(max_length=30)
	personal_email_address = models.EmailField()
	linkedin_account = models.CharField(max_length=255, default='', blank=True)
	facebook_account = models.CharField(max_length=255, default='', blank=True)
	messenger_account = models.CharField(max_length=255, default='', blank=True)
	company_name = models.CharField(max_length=200)
	company_category = models.CharField(max_length=20, default='private')
	industry_type = models.CharField(max_length=150)
	company_office_address = models.TextField()
	company_landline_no = models.CharField(max_length=30)
	company_email_address = models.EmailField()
	company_id_to_bring = models.BooleanField(default=False)
	vehicle_type = models.CharField(max_length=100, default='')
	will_come = models.BooleanField(default=True)
	attendee_count = models.PositiveIntegerField(default=1)
	additional_attendees = models.JSONField(default=list, blank=True)
	data_privacy_consent = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"{self.last_name}, {self.first_name} ({self.company_name})"
