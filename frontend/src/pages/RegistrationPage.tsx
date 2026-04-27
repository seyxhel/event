import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  Cpu,
  Mail,
  Network,
  Phone,
  ShieldCheck,
  Users
} from 'lucide-react';
import { EventMetaGrid } from '../components/EventMetaGrid';
import { apiUrl } from '../api';
import { EVENT_CONTACTS, EVENT_DETAILS } from '../eventDetails';

const API_URL = apiUrl('/api/register/');

interface FormData {
  privacyAccepted: boolean;
  lastName: string;
  firstName: string;
  middleInitial: string;
  email: string;
  mobileNo: string;
  gender: string;
  schoolUniversity: string;
  course: string;
  yearLevel: string;
}

const initialFormData: FormData = {
  privacyAccepted: false,
  lastName: '',
  firstName: '',
  middleInitial: '',
  email: '',
  mobileNo: '',
  gender: '',
  schoolUniversity: '',
  course: '',
  yearLevel: ''
};

const REQUIRED_FIELD_CHECKS: Array<(data: FormData) => boolean> = [
  (data) => data.privacyAccepted,
  (data) => data.lastName.trim().length > 0,
  (data) => data.firstName.trim().length > 0,
  (data) => data.email.trim().length > 0,
  (data) => data.mobileNo.trim().length > 0,
  (data) => data.gender.trim().length > 0,
  (data) => data.schoolUniversity.trim().length > 0,
  (data) => data.course.trim().length > 0,
  (data) => data.yearLevel.trim().length > 0
];

const HERO_HIGHLIGHTS: Array<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  cardTone: string;
  iconTone: string;
}> = [
  {
    icon: ShieldCheck,
    label: 'Security Controls',
    cardTone: 'from-[#eafff0] via-[#f4fff8] to-[#edfff9] border-[#b8e4c9]',
    iconTone: 'border-[#8fcfa2] from-[#d9ffe5] to-[#f2ffe9] text-[#2b8850]'
  },
  {
    icon: Network,
    label: 'Framework Mapping',
    cardTone: 'from-[#eef7ff] via-[#f3f9ff] to-[#effcff] border-[#c2d8ee]',
    iconTone: 'border-[#9fbee1] from-[#dbe9ff] to-[#e9f3ff] text-[#2f689e]'
  },
  {
    icon: Cpu,
    label: 'Confident Deployment',
    cardTone: 'from-[#fff6e8] via-[#fff9ef] to-[#f5ffe8] border-[#e3d2a3]',
    iconTone: 'border-[#d6b97a] from-[#ffeaba] to-[#fff5dc] text-[#9a6f1d]'
  }
];

export function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedChecks = useMemo(() => {
    return REQUIRED_FIELD_CHECKS.filter((check) => check(formData)).length;
  }, [formData]);

  const baselineCompletedChecks = useMemo(() => {
    return REQUIRED_FIELD_CHECKS.filter((check) => check(initialFormData)).length;
  }, []);

  const actionableTotalChecks = REQUIRED_FIELD_CHECKS.length - baselineCompletedChecks;
  const actionableCompletedChecks = Math.max(0, completedChecks - baselineCompletedChecks);

  const completionPercentage =
    actionableTotalChecks > 0
      ? Math.round((actionableCompletedChecks / actionableTotalChecks) * 100)
      : 0;
  const requiredRemaining = Math.max(0, actionableTotalChecks - actionableCompletedChecks);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let nextValue = value;
    if (name === 'middleInitial') {
      nextValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 1);
    }
    if (name === 'mobileNo') {
      nextValue = value.replace(/\D/g, '').slice(0, 11);
    }

    setFormData((prev) => {
      return {
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : type === 'number'
              ? Number(value)
              : nextValue
      } as FormData;
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
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.mobileNo) newErrors.mobileNo = 'Mobile No. is required';
    else if (!/^\d{11}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile No. must be exactly 11 digits';
    }
    if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
    if (!formData.schoolUniversity.trim()) newErrors.schoolUniversity = 'School / University is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.yearLevel.trim()) newErrors.yearLevel = 'Year level is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapServerErrors = (backendErrors: Record<string, string[]>) => {
    const fieldMap: Record<string, keyof FormData> = {
      data_privacy_consent: 'privacyAccepted',
      email: 'email',
      first_name: 'firstName',
      last_name: 'lastName',
      middle_initial: 'middleInitial',
      designation: 'yearLevel',
      mobile_cp_no: 'mobileNo',
      company_category: 'gender',
      company_name: 'schoolUniversity',
      industry_type: 'course',
      year_level: 'yearLevel',
      company_office_address: 'schoolUniversity',
      company_landline_no: 'yearLevel',
      company_email_address: 'email'
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
        privacyAccepted: formData.privacyAccepted,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleInitial: formData.middleInitial,
        email: formData.email.trim(),
        mobileNo: formData.mobileNo.trim(),
        gender: formData.gender,
        schoolUniversity: formData.schoolUniversity.trim(),
        course: formData.course.trim(),
        yearLevel: formData.yearLevel.trim()
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        throw new Error('API endpoint returned a non-JSON response.');
      }

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
    } catch (_error) {
      setSubmitError(
        'Unable to reach the API. On Railway, set VITE_API_BASE_URL in the frontend service to your backend public URL and redeploy.'
      );
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
    <div className="min-h-screen pb-14 pt-6 sm:pb-16 sm:pt-8">

      <div className="relative z-10 mx-auto mt-5 max-w-6xl px-3 sm:mt-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="glass-panel section-reveal relative overflow-hidden p-5 text-center sm:p-7 md:p-9"
        >
          <div
            className="hero-chroma-flow absolute left-0 top-0 h-1.5 w-full"
            style={{
              background:
                'linear-gradient(90deg, #47c974 0%, #65c9ff 34%, #ffd573 68%, #47c974 100%)'
            }}
          />

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#44c176]/20 blur-3xl" />
            <div className="absolute -left-6 bottom-6 h-36 w-36 rounded-full bg-[#54bff0]/18 blur-3xl" />
            <div className="absolute bottom-0 right-6 h-36 w-36 rounded-full bg-[#d7b55f]/16 blur-3xl" />
            <div className="absolute right-5 top-4 h-24 w-24 rounded-full border border-[#c3d7ca]/60 bg-[#f7fcf8]/70" />

            <div className="icon-drift absolute left-4 top-5 hidden h-10 w-10 items-center justify-center rounded-full border border-[#9ecfb2]/85 bg-[#f2fff6]/85 sm:flex">
              <ShieldCheck className="icon-blink h-4 w-4 text-[#2f8552]" />
            </div>

            <div
              className="icon-drift absolute bottom-6 right-4 hidden h-10 w-10 items-center justify-center rounded-full border border-[#bccde4]/85 bg-[#f2f8ff]/85 sm:flex"
              style={{ animationDelay: '-1.9s' }}
            >
              <Network className="icon-blink h-4 w-4 text-[#366aa1]" style={{ animationDelay: '0.5s' }} />
            </div>

            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(58,116,83,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(58,116,83,0.26) 1px, transparent 1px)',
                backgroundSize: '36px 36px'
              }}
            />
          </div>

          <div className="relative z-10">
            <p className="meta-badge inline-flex">Maptech Information Solutions Inc.</p>
            <h1 className="display-font mt-4 text-3xl leading-[0.95] text-[#1d4f3a] sm:text-5xl md:text-6xl">
              <span className="glossy-title">{EVENT_DETAILS.title}</span>
            </h1>
            <p className="display-font mt-2 text-2xl font-semibold text-[#8b6a22] sm:text-3xl md:text-4xl">
              {EVENT_DETAILS.subtitle}
            </p>
            <p className="mx-auto mt-5 max-w-4xl rounded-full border border-[#cadbcf]/85 bg-[#ffffff]/74 px-4 py-2 text-sm tracking-[0.12em] text-[#476556] uppercase md:text-base">
              {EVENT_DETAILS.tagline}
            </p>

            <div className="mx-auto mt-5 grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {HERO_HIGHLIGHTS.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className={`glass-panel-soft flex items-center gap-3 rounded-xl border bg-gradient-to-br px-3 py-2.5 text-left sm:justify-center ${item.cardTone}`}
                  >
                    <span
                      className={`icon-halo flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-br ${item.iconTone}`}
                      style={{ animationDelay: `${index * 0.45}s` }}
                    >
                      <Icon className="icon-blink h-4 w-4" />
                    </span>
                    <p className="display-font text-sm text-[#244d39] sm:text-base">{item.label}</p>
                  </article>
                );
              })}
            </div>

            <div className="accent-divider mt-6" />
          </div>
        </motion.section>
      </div>

      <div className="relative z-10 mx-auto mt-4 max-w-6xl px-3 sm:mt-5 sm:px-6 lg:px-8">
        <EventMetaGrid />
      </div>

      <div className="relative z-10 mx-auto mt-5 max-w-6xl px-3 sm:mt-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.08 }}
          className="glass-panel section-reveal p-4 sm:p-6 md:p-8"
        >
          <h2 className="display-font mb-4 flex items-center gap-2 text-xl text-[#1f4736] sm:text-2xl md:mb-5 md:text-3xl">
            <ShieldCheck className="h-6 w-6 text-[#3f8657]" />
            Event Contacts
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-3">
              {EVENT_CONTACTS.map((contact) => (
                <div
                  key={contact.phone}
                  className="glass-panel-soft hover-lift flex items-center gap-3 px-3 py-2 sm:py-2.5"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#b9923d]" />
                  <p className="text-sm text-[#2b5642] md:text-base">
                    {contact.name} - {contact.phone}
                  </p>
                </div>
              ))}
            </div>

            <div className="glass-panel-soft hover-lift flex flex-col justify-center gap-4 p-4 sm:p-5">
              <div className="flex items-center gap-3 text-[#2b5642]">
                <Phone className="h-5 w-5 text-[#3f8657]" />
                <span className="text-base font-semibold sm:text-lg">{EVENT_DETAILS.officeLandline}</span>
              </div>
              <div className="flex items-center gap-3 text-[#2b5642]">
                <Mail className="h-5 w-5 text-[#3f8657]" />
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EVENT_DETAILS.officeEmail)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-semibold underline decoration-[#7aa88e] underline-offset-2 hover:text-[#1f4736] sm:text-lg"
                >
                  {EVENT_DETAILS.officeEmail}
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="relative z-10 mx-auto mt-5 max-w-6xl px-3 sm:mt-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.14 }}
          className="glass-panel section-reveal p-4 sm:p-6 md:p-10"
        >
          <header className="mb-6 border-b border-[#c9dbcf]/90 pb-5 sm:mb-8 sm:pb-6">
            <h2 className="display-font text-2xl text-[#1f4736] sm:text-3xl md:text-4xl">Registration Form</h2>
            <p className="mt-2 text-sm text-[#5f7568] md:text-base">
              Complete the required fields below to secure your slot.
            </p>
          </header>

          <div className="glass-panel-soft mb-7 p-3.5 sm:mb-8 sm:p-4 md:p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="form-label">Completion Progress</p>
              <p className="display-font text-lg font-bold text-[#8b6a22]">
                {completionPercentage}%
              </p>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#e3ede6]">
              <motion.div
                initial={false}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.25 }}
                className="progress-shimmer h-full rounded-full bg-gradient-to-r from-[#4f9867] via-[#79ab84] to-[#b9923d]"
              />
            </div>

            <p className="mt-2 text-xs text-[#607769] md:text-sm">
              {requiredRemaining === 0
                ? 'All required fields are complete. You can submit now.'
                : `${requiredRemaining} required item${requiredRemaining > 1 ? 's' : ''} left.`}
            </p>
          </div>

          {submitError && (
            <div className="mb-5 rounded-xl border border-[#d9a1a1] bg-[#fff3f3] p-3.5 text-[#b64a4a]">
              <p className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {submitError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div
              className={`rounded-xl border p-3.5 sm:p-4 ${
                errors.privacyAccepted
                  ? 'border-[#d9a1a1] bg-[#fff4f4]'
                  : 'border-[#bfd5c7] bg-[#f5faf6]'
              }`}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    formData.privacyAccepted
                      ? 'border-[#3f8657] bg-[#3f8657]'
                      : 'border-[#a9c2b2] bg-[#ffffff]'
                  }`}
                >
                  <Check
                    className={`h-4 w-4 transition-opacity ${
                      formData.privacyAccepted ? 'opacity-100 text-[#ffffff]' : 'opacity-0 text-[#3f8657]'
                    }`}
                  />
                </span>
                <span className="text-sm text-[#335f49] md:text-base">
                  I agree to the collection and processing of my personal data in accordance with
                  the Data Privacy Act of 2012 (RA 10173).
                </span>
              </label>

              {errors.privacyAccepted && (
                <p className="mt-2 flex items-center gap-1 text-sm text-[#b64a4a]">
                  <AlertCircle className="h-4 w-4" />
                  {errors.privacyAccepted}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
              <SectionTitle title="Attendee Details" icon={Users} />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <FormField
                label="Middle Initial"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                error={errors.middleInitial}
                maxLength={1}
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                className="md:col-span-2"
              />

              <SectionTitle title="Contact Details" icon={Phone} className="mt-2" />
              <FormField
                label="Contact No."
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                error={errors.mobileNo}
                maxLength={11}
                required
                className="md:col-span-2"
              />
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="gender" className="form-label flex items-center gap-1">
                  Gender
                  <span className="text-[#c05b5b]">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-input form-select-themed ${errors.gender ? 'form-input-error' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && <span className="text-xs text-[#b64a4a]">{errors.gender}</span>}
              </div>

              <SectionTitle title="School Details" icon={Cpu} className="mt-2" />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="yearLevel" className="form-label flex items-center gap-1">
                  Year Level
                  <span className="text-[#c05b5b]">*</span>
                </label>
                <select
                  id="yearLevel"
                  name="yearLevel"
                  value={formData.yearLevel}
                  onChange={handleChange}
                  className={`form-input form-select-themed ${errors.yearLevel ? 'form-input-error' : ''}`}
                >
                  <option value="">Select Year Level</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year+">5th Year+</option>
                </select>
                {errors.yearLevel && <span className="text-xs text-[#b64a4a]">{errors.yearLevel}</span>}
              </div>
              <FormField
                label="School / University"
                name="schoolUniversity"
                value={formData.schoolUniversity}
                onChange={handleChange}
                error={errors.schoolUniversity}
                required
              />
              <FormField
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                error={errors.course}
                required
              />

            </div>

            <div className="flex flex-col gap-3 border-t border-[#cadbcf] pt-6 sm:flex-row sm:pt-7">
              <button
                type="button"
                onClick={handleClear}
                className="secondary-btn px-6 py-2.5 text-sm md:text-base"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-btn sm:ml-auto px-7 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
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
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
};

function SectionTitle({ title, icon: Icon, className = '' }: SectionTitleProps) {
  return (
    <div className={`md:col-span-2 ${className}`}>
      <h3 className="display-font flex items-center gap-2 text-xl text-[#1f4736] sm:text-2xl md:text-[1.75rem]">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#a8c2b3] bg-[#f2f8f3] sm:h-8 sm:w-8">
          <Icon className="h-4 w-4 text-[#3f8657]" />
        </span>
        {title}
      </h3>
      <div className="accent-divider mt-2" />
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
  min?: number;
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
  min,
  placeholder,
  disabled
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="form-label flex items-center gap-1">
        {label}
        {required && <span className="text-[#c05b5b]">*</span>}
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
        min={type === 'number' ? (min ?? 0).toString() : undefined}
        className={`form-input ${error ? 'form-input-error' : ''} ${
          disabled ? 'form-input-disabled' : ''
        }`}
      />

      {error && <span className="text-xs text-[#b64a4a]">{error}</span>}
    </div>
  );
}
