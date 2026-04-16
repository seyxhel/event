import re

from django import forms

from .models import EventRegistration


INDUSTRY_TYPE_CHOICES = (
    ('Education', 'Education'),
    ('Healthcare', 'Healthcare'),
    ('Retail', 'Retail'),
    ('Finance', 'Finance'),
    ('Constructions', 'Constructions'),
    ('E-Commerce', 'E-Commerce'),
    ('Others', 'Others'),
)
INDUSTRY_TYPE_VALUES = {choice[0] for choice in INDUSTRY_TYPE_CHOICES}


class EventRegistrationForm(forms.ModelForm):
    OPTIONAL_FIELDS = (
        'middle_initial',
        'viber_no',
        'vehicle_type',
        'additional_attendees',
        'linkedin_account',
        'facebook_account',
        'messenger_account',
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
            'linkedin_account',
            'facebook_account',
            'messenger_account',
            'company_name',
            'company_category',
            'industry_type',
            'company_office_address',
            'company_landline_no',
            'company_email_address',
            'company_id_to_bring',
            'vehicle_type',
            'will_come',
            'attendee_count',
            'additional_attendees',
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
            'linkedin_account': forms.TextInput(attrs={'class': 'input-field'}),
            'facebook_account': forms.TextInput(attrs={'class': 'input-field'}),
            'messenger_account': forms.TextInput(attrs={'class': 'input-field'}),
            'company_name': forms.TextInput(attrs={'class': 'input-field'}),
            'company_category': forms.Select(
                attrs={'class': 'input-field'},
                choices=(
                    ('government', 'Government'),
                    ('private', 'Private'),
                ),
            ),
            'industry_type': forms.Select(
                attrs={'class': 'input-field'},
                choices=(
                    ('', 'Select Industry Type'),
                    *INDUSTRY_TYPE_CHOICES,
                ),
            ),
            'company_office_address': forms.Textarea(attrs={'class': 'input-field textarea-field', 'rows': 3}),
            'company_landline_no': forms.TextInput(attrs={'class': 'input-field'}),
            'company_email_address': forms.EmailInput(attrs={'class': 'input-field'}),
            'company_id_to_bring': forms.CheckboxInput(attrs={'class': 'checkbox-input'}),
            'vehicle_type': forms.TextInput(attrs={'class': 'input-field'}),
            'will_come': forms.CheckboxInput(attrs={'class': 'checkbox-input'}),
            'attendee_count': forms.NumberInput(attrs={'class': 'input-field', 'min': '1'}),
            'additional_attendees': forms.HiddenInput(),
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
            'linkedin_account': 'LinkedIn Account',
            'facebook_account': 'Facebook Account',
            'messenger_account': 'Messenger Account',
            'company_name': 'Company Name',
            'company_category': 'Company Category',
            'industry_type': 'Industry Type',
            'company_office_address': 'Company Office Address',
            'company_landline_no': 'Company Landline No.',
            'company_email_address': 'Company Email Address',
            'company_id_to_bring': 'I will bring my Company ID on event day.',
            'vehicle_type': 'Type of Vehicle to Bring',
            'will_come': 'I confirm I will attend the event.',
            'attendee_count': 'How many people will go',
            'additional_attendees': 'Additional attendees',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name in self.OPTIONAL_FIELDS:
            self.fields[field_name].required = False

    def clean_middle_initial(self):
        middle_initial = (self.cleaned_data.get('middle_initial') or '').strip().upper()
        if not middle_initial:
            return ''

        if len(middle_initial) != 1 or not re.match(r'^[A-Z0-9]$', middle_initial):
            raise forms.ValidationError('Middle initial must be exactly one letter or number.')

        return f'{middle_initial}.'

    def clean_data_privacy_consent(self):
        consent = self.cleaned_data.get('data_privacy_consent')
        if not consent:
            raise forms.ValidationError('You must agree to the Data Privacy Act before submitting.')
        return consent

    def clean_mobile_cp_no(self):
        mobile_cp_no = (self.cleaned_data.get('mobile_cp_no') or '').strip()
        if not re.match(r'^\d{11}$', mobile_cp_no):
            raise forms.ValidationError('Mobile/CP No. must be exactly 11 digits.')
        return mobile_cp_no

    def clean_gcash_no(self):
        gcash_no = (self.cleaned_data.get('gcash_no') or '').strip()
        if not re.match(r'^\d{11}$', gcash_no):
            raise forms.ValidationError('G-Cash No. must be exactly 11 digits.')
        return gcash_no

    def clean_attendee_count(self):
        return 1

    def clean_company_category(self):
        category = (self.cleaned_data.get('company_category') or '').strip().lower()
        if category not in {'government', 'private'}:
            raise forms.ValidationError('Company category must be Government or Private.')
        return category

    def clean_industry_type(self):
        industry_type = (self.cleaned_data.get('industry_type') or '').strip()
        if not industry_type:
            raise forms.ValidationError('Industry Type is required.')
        if industry_type == 'Others':
            raise forms.ValidationError('Please specify your industry type.')
        if industry_type in INDUSTRY_TYPE_VALUES:
            return industry_type
        if len(industry_type) > 150:
            raise forms.ValidationError('Specified industry type is too long.')
        return industry_type

    def clean_additional_attendees(self):
        return []

    def clean(self):
        cleaned_data = super().clean()
        cleaned_data['will_come'] = True
        cleaned_data['attendee_count'] = 1
        cleaned_data['additional_attendees'] = []
        return cleaned_data
