from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		('registrations', '0007_eventfeedback_personal_company_info_consent'),
	]

	operations = [
		migrations.AddField(
			model_name='eventregistration',
			name='attendance_mode',
			field=models.CharField(choices=[('onsite', 'Onsite'), ('via_online', 'Via Online')], default='onsite', max_length=20),
		),
	]