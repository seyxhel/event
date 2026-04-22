from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registrations', '0005_eventregistration_social_accounts_and_company_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventregistration',
            name='duplicate_score',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='eventregistration',
            name='duplicate_status',
            field=models.CharField(default='green', max_length=10),
        ),
    ]
