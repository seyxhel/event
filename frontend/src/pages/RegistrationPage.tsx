import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { ScrollFadeBanner } from '../components/ScrollFadeBanner';

const BANNER_URL = '/event-banner.jpeg';
const API_URL = import.meta.env.VITE_API_REGISTER_URL || '/api/register/';

interface FormData {
  privacyAccepted: boolean;
  email: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  designation: string;
  mobileNo: string;
  viberNo: string;
  gcashNo: string;
  personalEmail: string;
  companyName: string;
  industryType: string;
  companyAddress: string;
  companyLandline: string;
  companyEmail: string;
  bringCompanyId: boolean;
  vehicleType: string;
  willCome: boolean;
  attendeeCount: number;
}

const initialFormData: FormData = {
  privacyAccepted: false,
  email: '',
  lastName: '',
  firstName: '',
  middleInitial: '',
  designation: '',
  mobileNo: '',
  viberNo: '',
  gcashNo: '',
  personalEmail: '',
  companyName: '',
  industryType: '',
  companyAddress: '',
  companyLandline: '',
  companyEmail: '',
  bringCompanyId: false,
  vehicleType: '',
  willCome: false,
  attendeeCount: 0
};

export function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      } as FormData;

      if (name === 'willCome') {
        newData.attendeeCount = checked ? 1 : 0;
      }
      return newData;
    });

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the Data Privacy Act to proceed.';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.mobileNo) newErrors.mobileNo = 'Mobile No. is required';
    if (!formData.companyName) newErrors.companyName = 'Company Name is required';
    if (formData.willCome && formData.attendeeCount < 1) {
      newErrors.attendeeCount = 'Attendee count must be at least 1 if you are coming';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapServerErrors = (backendErrors: Record<string, string[]>) => {
    const fieldMap: Record<string, keyof FormData> = {
      data_privacy_consent: 'privacyAccepted',
      email: 'email',
      last_name: 'lastName',
      first_name: 'firstName',
      middle_initial: 'middleInitial',
      designation: 'designation',
      mobile_cp_no: 'mobileNo',
      viber_no: 'viberNo',
      gcash_no: 'gcashNo',
      personal_email_address: 'personalEmail',
      company_name: 'companyName',
      industry_type: 'industryType',
      company_office_address: 'companyAddress',
      company_landline_no: 'companyLandline',
      company_email_address: 'companyEmail',
      company_id_to_bring: 'bringCompanyId',
      vehicle_type: 'vehicleType',
      will_come: 'willCome',
      attendee_count: 'attendeeCount',
    };

    const mapped: Partial<Record<keyof FormData, string>> = {};
    Object.entries(backendErrors).forEach(([key, values]) => {
      const field = fieldMap[key];
      if (field && values.length > 0) {
        mapped[field] = values[0];
      }
    });
    return mapped;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        ...formData,
        companyIdToBring: formData.bringCompanyId,
        attendeeCount: Number(formData.attendeeCount || 0)
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        if (data?.errors) {
          setErrors(mapServerErrors(data.errors));
        }
        setSubmitError('Submission failed. Please review your inputs and try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      navigate('/success', {
        state: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          refNumber: data.reference
        }
      });
    } catch (error) {
      setSubmitError('Unable to connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f8faf8]">
      <ScrollFadeBanner
        src={BANNER_URL}
        alt="The Cybersecurity Implementation Journey"
        maxHeightClassName="max-h-[60vh]"
        maxHeightVh={60}
        fadeDistance={520}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        <div className="rounded-2xl border border-[#d8e8cf] bg-white/95 shadow-lg backdrop-blur px-5 py-4 md:px-6 md:py-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm text-gray-700">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Date</p>
              <p className="mt-1 font-semibold">May 12, 2026, Tuesday</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Venue</p>
              <p className="mt-1 font-semibold">Oasis Manila</p>
              <p className="text-xs text-gray-500">Aurora Blvd, San Juan City</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Event Time</p>
              <p className="mt-1 font-semibold">9:00 AM - 5:00 PM</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Registration Starts</p>
              <p className="mt-1 font-semibold">8:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-white border-t-4 border-t-[#d4a843] rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            Event Contacts
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Maptech Information Solutions Inc.</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#d4a843]" /><span>Ms. Prud De Leon - 0956-396-1012</span></li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#d4a843]" /><span>Mr. Edar Bernardo - 0999-227-9291</span></li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#d4a843]" /><span>Mr. Ralph Rivera - 0917-182-8320</span></li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#d4a843]" /><span>Mr. Daniel Castillo - 0917-148-2857</span></li>
              </ul>
            </div>
            <div className="flex flex-col justify-center space-y-4 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-3 text-gray-700"><Phone className="w-5 h-5 text-green-600" /><span className="text-lg font-medium">(02) 8800-5399</span></div>
              <div className="flex items-center gap-3 text-gray-700"><Mail className="w-5 h-5 text-green-600" /><span className="text-lg font-medium">sales@maptechisi.com</span></div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-xl"
        >
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Form</h2>
            <p className="text-gray-500">Please fill out the details below to secure your spot.</p>
          </div>

          {submitError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">{submitError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className={`p-4 rounded-lg border ${errors.privacyAccepted ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleChange}
                    className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded bg-white checked:bg-green-600 checked:border-green-600 transition-colors cursor-pointer"
                  />
                  <ShieldCheck className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity" />
                </div>
                <span className="text-sm text-gray-700 leading-relaxed font-medium">
                  I agree to the collection and processing of my personal data in accordance with the Data Privacy Act of 2012 (RA 10173).
                </span>
              </label>
              {errors.privacyAccepted && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-4 h-4" /> {errors.privacyAccepted}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectionTitle title="Personal Details" />
              <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required className="md:col-span-2" />
              <FormField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
              <FormField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
              <FormField label="Middle Initial" name="middleInitial" value={formData.middleInitial} onChange={handleChange} maxLength={2} />
              <FormField label="Designation / Job Title" name="designation" value={formData.designation} onChange={handleChange} />

              <SectionTitle title="Contact Details" className="mt-4" />
              <FormField label="Mobile / Cellphone No." name="mobileNo" value={formData.mobileNo} onChange={handleChange} error={errors.mobileNo} required />
              <FormField label="Viber No." name="viberNo" value={formData.viberNo} onChange={handleChange} />
              <FormField label="GCash No. (for raffle)" name="gcashNo" value={formData.gcashNo} onChange={handleChange} />
              <FormField label="Personal Email Address" name="personalEmail" type="email" value={formData.personalEmail} onChange={handleChange} className="md:col-span-2" />

              <SectionTitle title="Company Details" className="mt-4" />
              <FormField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} required className="md:col-span-2" />
              <FormField label="Industry Type" name="industryType" value={formData.industryType} onChange={handleChange} />
              <FormField label="Company Landline No." name="companyLandline" value={formData.companyLandline} onChange={handleChange} />
              <FormField label="Company Office Address" name="companyAddress" value={formData.companyAddress} onChange={handleChange} className="md:col-span-2" />
              <FormField label="Company Email Address" name="companyEmail" type="email" value={formData.companyEmail} onChange={handleChange} className="md:col-span-2" />

              <SectionTitle title="Event Logistics" className="mt-4" />
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bringCompanyId"
                  name="bringCompanyId"
                  checked={formData.bringCompanyId}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="bringCompanyId" className="text-sm font-medium text-gray-700">I will bring my company ID</label>
              </div>

              <FormField
                label="Type of vehicle to bring"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                placeholder="e.g., Car, Motorcycle, None"
                className="md:col-span-2"
              />

              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="willCome"
                    name="willCome"
                    checked={formData.willCome}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="willCome" className="text-sm font-bold text-gray-900">I will attend the event</label>
                </div>

                <div className="flex-1 max-w-xs">
                  <FormField
                    label="Attendee count"
                    name="attendeeCount"
                    type="number"
                    value={formData.attendeeCount.toString()}
                    onChange={handleChange}
                    error={errors.attendeeCount}
                    disabled={!formData.willCome}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none w-full sm:w-auto"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none w-full sm:w-auto sm:ml-auto shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
}

type SectionTitleProps = {
  title: string;
  className?: string;
};

function SectionTitle({ title, className = '' }: SectionTitleProps) {
  return (
    <div className={`md:col-span-2 ${className}`}>
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <span className="w-2 h-6 bg-[#d4a843] rounded-full"></span>
        {title}
      </h3>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
};

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
  className = '',
  maxLength,
  placeholder,
  disabled
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        min={type === 'number' ? '0' : undefined}
        className={`
          w-full px-4 py-2.5 rounded-lg bg-white border
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-green-500 focus:ring-green-200'}
          ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-900'}
          placeholder-gray-400
          focus:outline-none focus:ring-4 transition-all shadow-sm
        `}
      />
      {error && <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>}
    </div>
  );
}
