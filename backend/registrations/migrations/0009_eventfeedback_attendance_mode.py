from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		('registrations', '0008_eventregistration_attendance_mode'),
	]

	operations = [
		migrations.AddField(
			model_name='eventfeedback',
			name='attendance_mode',
			field=models.CharField(choices=[('onsite', 'Onsite'), ('via_online', 'Via Online')], default='onsite', max_length=20),
		),
	]