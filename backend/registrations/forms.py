from django import forms

from .models import EventRegistration


class EventRegistrationForm(forms.ModelForm):
    OPTIONAL_FIELDS = (
        'middle_initial',
        'designation',
        'viber_no',
        'gcash_no',
        'personal_email_address',
        'industry_type',
        'company_office_address',
        'company_landline_no',
        'company_email_address',
        'vehicle_type',
    )

    class Meta:
        model = EventRegistration
        fields = [
            'data_privacy_consent',
            'email',
            'last_name',
            'first_name',
            'middle_initial',
            'designation',
            'mobile_cp_no',
            'viber_no',
            'gcash_no',
            'personal_email_address',
            'company_name',
            'industry_type',
            'company_office_address',
            'company_landline_no',
            'company_email_address',
            'company_id_to_bring',
            'vehicle_type',
            'will_come',
            'attendee_count',
        ]
        widgets = {
            'data_privacy_consent': forms.CheckboxInput(attrs={'class': 'checkbox-input'}),
            'email': forms.EmailInput(attrs={'class': 'input-field'}),
            'last_name': forms.TextInput(attrs={'class': 'input-field'}),
            'first_name': forms.TextInput(attrs={'class': 'input-field'}),
            'middle_initial': forms.TextInput(attrs={'class': 'input-field', 'maxlength': '1'}),
            'designation': forms.TextInput(attrs={'class': 'input-field'}),
            'mobile_cp_no': forms.TextInput(attrs={'class': 'input-field'}),
            'viber_no': forms.TextInput(attrs={'class': 'input-field'}),
            'gcash_no': forms.TextInput(attrs={'class': 'input-field'}),
            'personal_email_address': forms.EmailInput(attrs={'class': 'input-field'}),
            'company_name': forms.TextInput(attrs={'class': 'input-field'}),
            'industry_type': forms.TextInput(attrs={'class': 'input-field'}),
            'company_office_address': forms.Textarea(attrs={'class': 'input-field textarea-field', 'rows': 3}),
            'company_landline_no': forms.TextInput(attrs={'class': 'input-field'}),
            'company_email_address': forms.EmailInput(attrs={'class': 'input-field'}),
            'company_id_to_bring': forms.CheckboxInput(attrs={'class': 'checkbox-input'}),
            'vehicle_type': forms.TextInput(attrs={'class': 'input-field'}),
            'will_come': forms.CheckboxInput(attrs={'class': 'checkbox-input'}),
            'attendee_count': forms.NumberInput(attrs={'class': 'input-field', 'min': '0'}),
        }
        labels = {
            'data_privacy_consent': 'I agree to the Data Privacy Act and consent to processing of my details for this event.',
            'email': 'Email',
            'last_name': 'Last Name',
            'first_name': 'First Name',
            'middle_initial': 'Middle Initial',
            'designation': 'Designation',
            'mobile_cp_no': 'Mobile/CP No.',
            'viber_no': 'Viber No.',
            'gcash_no': 'G-Cash No. (for raffle)',
            'personal_email_address': 'Personal Email Address',
            'company_name': 'Company Name',
            'industry_type': 'Industry Type',
            'company_office_address': 'Company Office Address',
            'company_landline_no': 'Company Landline No.',
            'company_email_address': 'Company Email Address',
            'company_id_to_bring': 'I will bring my Company ID on event day.',
            'vehicle_type': 'Type of Vehicle to Bring',
            'will_come': 'I confirm I will attend the event.',
            'attendee_count': 'How many people will go',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name in self.OPTIONAL_FIELDS:
            self.fields[field_name].required = False

    def clean_middle_initial(self):
        middle_initial = (self.cleaned_data.get('middle_initial') or '').strip().upper()
        if middle_initial and len(middle_initial) != 1:
            raise forms.ValidationError('Middle initial must be exactly one character.')
        return middle_initial

    def clean_data_privacy_consent(self):
        consent = self.cleaned_data.get('data_privacy_consent')
        if not consent:
            raise forms.ValidationError('You must agree to the Data Privacy Act before submitting.')
        return consent

    def clean_attendee_count(self):
        attendee_count = self.cleaned_data.get('attendee_count')
        if attendee_count is None or attendee_count < 0:
            raise forms.ValidationError('Attendee count must be zero or greater.')
        return attendee_count

    def clean(self):
        cleaned_data = super().clean()
        will_come = cleaned_data.get('will_come')
        attendee_count = cleaned_data.get('attendee_count')

        if will_come and (attendee_count is None or attendee_count < 1):
            self.add_error('attendee_count', 'Please provide at least 1 attendee if coming.')
        if will_come is False and attendee_count and attendee_count > 0:
            self.add_error('attendee_count', 'Set attendee count to 0 if not attending.')

        return cleaned_data
