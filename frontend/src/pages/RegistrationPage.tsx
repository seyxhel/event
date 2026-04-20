import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ClipboardList,
  Cpu,
  MessageSquare,
  Network,
  ShieldCheck
} from 'lucide-react';
import { apiUrl } from '../api';
import { EVENT_DETAILS } from '../eventDetails';

const API_URL = apiUrl('/api/feedback/');

const LOGISTICS_ITEMS = [
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'welcomeKit', label: 'Welcome kit' },
  { key: 'communication', label: 'Communication' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'welcomeActivity', label: 'Welcome activity' },
  { key: 'venue', label: 'Venue' },
  { key: 'activities', label: 'Activities' },
  { key: 'closingCeremony', label: 'Closing ceremony' }
] as const;

const LOGISTICS_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: 'na', label: 'N/A' }
] as const;

const SESSION_ITEMS = [
  { key: 'welcomeActivity', label: 'Welcome activity' },
  { key: 'speaker1', label: 'Speaker #1' },
  { key: 'activity1', label: 'Activity #1' },
  { key: 'speaker2', label: 'Speaker #2' },
  { key: 'activity2', label: 'Activity #2' },
  { key: 'closingActivity', label: 'Closing activity' }
] as const;

const SESSION_OPTIONS = [
  { value: 'not_relevant', label: 'Not relevant' },
  { value: 'relevant', label: 'Relevant' },
  { value: 'very_relevant', label: 'Very relevant' },
  { value: 'did_not_attend', label: 'Did not attend' }
] as const;

const SATISFACTION_LEGEND = [
  '1 - Very Dissatisfied',
  '2 - Dissatisfied',
  '3 - Neutral',
  '4 - Satisfied',
  '5 - Very Satisfied'
] as const;

type LogisticsKey = (typeof LOGISTICS_ITEMS)[number]['key'];
type LogisticsRating = (typeof LOGISTICS_OPTIONS)[number]['value'] | '';
type SessionKey = (typeof SESSION_ITEMS)[number]['key'];
type SessionRating = (typeof SESSION_OPTIONS)[number]['value'] | '';
type ScaleRating = '1' | '2' | '3' | '4' | '5' | '';
type ConsentChoice = 'agree' | 'disagree' | '';

interface FeedbackFormData {
  personalCompanyInfoConsent: ConsentChoice;
  eventSatisfaction: ScaleRating;
  jobRelevance: ScaleRating;
  keyTakeaways: string;
  logisticsRatings: Record<LogisticsKey, LogisticsRating>;
  logisticsAdditionalFeedback: string;
  sessionRelevance: Record<SessionKey, SessionRating>;
  sessionsAdditionalComments: string;
  overallFeedback: string;
}

interface FeedbackErrors {
  personalCompanyInfoConsent?: string;
  eventSatisfaction?: string;
  jobRelevance?: string;
  logisticsRatings?: string;
  logisticsAdditionalFeedback?: string;
  sessionRelevance?: string;
  keyTakeaways?: string;
  sessionsAdditionalComments?: string;
  overallFeedback?: string;
}

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

const createEmptyLogisticsRatings = (): Record<LogisticsKey, LogisticsRating> => ({
  accommodation: '',
  welcomeKit: '',
  communication: '',
  transportation: '',
  welcomeActivity: '',
  venue: '',
  activities: '',
  closingCeremony: ''
});

const createEmptySessionRatings = (): Record<SessionKey, SessionRating> => ({
  welcomeActivity: '',
  speaker1: '',
  activity1: '',
  speaker2: '',
  activity2: '',
  closingActivity: ''
});

const initialFormData: FeedbackFormData = {
  personalCompanyInfoConsent: '',
  eventSatisfaction: '',
  jobRelevance: '',
  keyTakeaways: '',
  logisticsRatings: createEmptyLogisticsRatings(),
  logisticsAdditionalFeedback: '',
  sessionRelevance: createEmptySessionRatings(),
  sessionsAdditionalComments: '',
  overallFeedback: ''
};

export function FeedbackPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allLogisticsRated = useMemo(
    () => Object.values(formData.logisticsRatings).every((value) => value !== ''),
    [formData.logisticsRatings]
  );

  const allSessionsRated = useMemo(
    () => Object.values(formData.sessionRelevance).every((value) => value !== ''),
    [formData.sessionRelevance]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FeedbackErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogisticsChange = (key: LogisticsKey, value: LogisticsRating) => {
    setFormData((prev) => ({
      ...prev,
      logisticsRatings: {
        ...prev.logisticsRatings,
        [key]: value
      }
    }));

    if (errors.logisticsRatings) {
      setErrors((prev) => ({ ...prev, logisticsRatings: undefined }));
    }
  };

  const handleSessionChange = (key: SessionKey, value: SessionRating) => {
    setFormData((prev) => ({
      ...prev,
      sessionRelevance: {
        ...prev.sessionRelevance,
        [key]: value
      }
    }));

    if (errors.sessionRelevance) {
      setErrors((prev) => ({ ...prev, sessionRelevance: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FeedbackErrors = {};

    if (!formData.personalCompanyInfoConsent) {
      newErrors.personalCompanyInfoConsent = 'Please select your consent option.';
    }

    if (!formData.eventSatisfaction) {
      newErrors.eventSatisfaction = 'Please rate your overall satisfaction with the event.';
    }

    if (!formData.jobRelevance) {
      newErrors.jobRelevance = 'Please rate how relevant and helpful the event was for your job.';
    }

    if (!allLogisticsRated) {
      newErrors.logisticsRatings = 'Please provide a rating for each logistics item.';
    }

    if (!allSessionsRated) {
      newErrors.sessionRelevance = 'Please provide a relevance rating for each session.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapServerErrors = (backendErrors: Record<string, string[]>) => {
    const fieldMap: Record<string, keyof FeedbackErrors> = {
      personal_company_info_consent: 'personalCompanyInfoConsent',
      event_satisfaction: 'eventSatisfaction',
      job_relevance: 'jobRelevance',
      key_takeaways: 'keyTakeaways',
      logistics_ratings: 'logisticsRatings',
      logistics_feedback: 'logisticsAdditionalFeedback',
      session_relevance: 'sessionRelevance',
      session_comments: 'sessionsAdditionalComments',
      overall_feedback: 'overallFeedback'
    };

    const mapped: FeedbackErrors = {};
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
      const logisticsAdditionalFeedback = formData.logisticsAdditionalFeedback.trim();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalCompanyInfoConsent: formData.personalCompanyInfoConsent === 'agree',
          eventSatisfaction: Number(formData.eventSatisfaction),
          jobRelevance: Number(formData.jobRelevance),
          keyTakeaways: formData.keyTakeaways.trim(),
          logisticsRatings: formData.logisticsRatings,
          // Keep compatibility with backends that still validate this field as required.
          logisticsAdditionalFeedback:
            logisticsAdditionalFeedback || 'No additional logistics feedback.',
          sessionRelevance: formData.sessionRelevance,
          sessionsAdditionalComments: formData.sessionsAdditionalComments.trim(),
          overallFeedback: formData.overallFeedback.trim()
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        const rawBody = await response.text();
        if (response.status === 403 && /csrf/i.test(rawBody)) {
          setSubmitError(
            'Submission is blocked by backend CSRF settings. Redeploy or restart the backend with the latest API updates.'
          );
        } else {
          setSubmitError('Submission failed. The API returned an unexpected response format.');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        if (data?.errors) {
          setErrors(mapServerErrors(data.errors));

          const firstError = Object.values(data.errors)
            .flat()
            .find((value): value is string => typeof value === 'string' && value.trim().length > 0);
          setSubmitError(firstError || 'Submission failed. Please review your answers and try again.');
        } else if (typeof data?.error === 'string' && data.error.trim().length > 0) {
          setSubmitError(data.error);
        } else {
          setSubmitError('Submission failed. Please review your answers and try again.');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      navigate('/success', {
        state: {
          mode: 'feedback',
          refNumber: data.reference,
          submittedAt: data.createdAt
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

      <div className="relative z-10 mx-auto mt-5 max-w-6xl px-3 sm:mt-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.14 }}
          className="glass-panel section-reveal p-4 sm:p-6 md:p-10"
        >
          <header className="mb-6 border-b border-[#c9dbcf]/90 pb-5 sm:mb-8 sm:pb-6">
            <h2 className="display-font text-2xl text-[#1f4736] sm:text-3xl md:text-4xl">Feedback Form</h2>
            <p className="mt-2 text-sm text-[#5f7568] md:text-base">
              Share your feedback to help us improve the next event experience.
            </p>
          </header>

          {submitError && (
            <div className="mb-5 rounded-xl border border-[#d9a1a1] bg-[#fff3f3] p-3.5 text-[#b64a4a]">
              <p className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {submitError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <article className="glass-panel-soft p-4 sm:p-5">
              <h3 className="display-font text-[1.7rem] text-[#1f4736] sm:text-3xl">Event feedback</h3>
              <p className="mt-3 text-base text-[#335f49] sm:text-lg">
                Thank you for participating in our event. We hope you had as much fun attending as we
                did organizing it.
              </p>
              <p className="mt-3 text-base text-[#335f49] sm:text-lg">
                We want to hear your feedback so we can keep improving our logistics and content.
                Please fill this quick survey and let us know your thoughts (your answers will be
                anonymous).
              </p>
            </article>

            <SectionTitle title="Overall Event" icon={ClipboardList} />
            <ScaleLegend />

            <LinearScaleQuestion
              name="eventSatisfaction"
              question="How satisfied were you with the event?"
              value={formData.eventSatisfaction}
              onChange={handleInputChange}
              minLabel="Not very"
              maxLabel="Very much"
              required
              error={errors.eventSatisfaction}
            />

            <LinearScaleQuestion
              name="jobRelevance"
              question="How relevant and helpful do you think it was for your job?"
              value={formData.jobRelevance}
              onChange={handleInputChange}
              minLabel="Not very"
              maxLabel="Very much"
              required
              error={errors.jobRelevance}
            />

            <TextResponseQuestion
              label="What were your key take aways from this event?"
              name="keyTakeaways"
              value={formData.keyTakeaways}
              onChange={handleInputChange}
            />

            <SectionTitle title="Logistics" icon={MessageSquare} className="pt-1" />
            <ScaleLegend />

            <MatrixQuestion
              question="How satisfied were you with the logistics?"
              rows={LOGISTICS_ITEMS}
              options={LOGISTICS_OPTIONS}
              values={formData.logisticsRatings as Record<string, string>}
              onChange={(rowKey, value) => handleLogisticsChange(rowKey as LogisticsKey, value as LogisticsRating)}
              namePrefix="logisticsRatings"
              required
              error={errors.logisticsRatings}
            />

            <TextResponseQuestion
              label="Additional feedback on logistics"
              name="logisticsAdditionalFeedback"
              value={formData.logisticsAdditionalFeedback}
              onChange={handleInputChange}
              error={errors.logisticsAdditionalFeedback}
            />

            <SectionTitle title="Sessions" icon={MessageSquare} className="pt-1" />

            <MatrixQuestion
              question="Which sessions did you find most relevant?"
              rows={SESSION_ITEMS}
              options={SESSION_OPTIONS}
              values={formData.sessionRelevance as Record<string, string>}
              onChange={(rowKey, value) => handleSessionChange(rowKey as SessionKey, value as SessionRating)}
              namePrefix="sessionRelevance"
              required
              error={errors.sessionRelevance}
            />

            <TextResponseQuestion
              label="What are your suggestions to improve the conduct of the seminar in the future?"
              name="sessionsAdditionalComments"
              value={formData.sessionsAdditionalComments}
              onChange={handleInputChange}
            />

            <TextResponseQuestion
              label="Overall feedback for the event?"
              name="overallFeedback"
              value={formData.overallFeedback}
              onChange={handleInputChange}
            />

            <article className="glass-panel-soft p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="display-font text-xl text-[#1f4736] sm:text-2xl">5. Consent Form</h3>
                <span className="text-lg leading-none text-[#c05b5b]">*</span>
              </div>
              <p className="mt-3 text-base text-[#335f49]">
                Event photos and videos have already been captured during the event. We request your consent to upload
                and use them.
              </p>
              <p className="mt-1 text-base font-semibold text-[#1f4736]">
                A. Photo &amp; Video Consent (Internal and External Use)
              </p>
              <p className="mt-2 text-sm italic text-[#4b6858]">Mark only one oval.</p>

              <div className="mt-3 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#d5e3da] bg-[#f7fcf8] p-3">
                  <input
                    type="radio"
                    name="personalCompanyInfoConsent"
                    value="agree"
                    checked={formData.personalCompanyInfoConsent === 'agree'}
                    onChange={handleInputChange}
                    className="mt-1 h-5 w-5 border-[#9ebdae] accent-[#3f8657] focus:ring-[#3f8657]/45"
                  />
                  <span className="text-sm text-[#244f3b] sm:text-base">
                    I allow Maptech Information Solutions Inc. to upload and use event photos and videos that may
                    include me for internal and external purposes, including documentation, reports,
                    presentations, social media, and promotional materials.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#d5e3da] bg-[#f7fcf8] p-3">
                  <input
                    type="radio"
                    name="personalCompanyInfoConsent"
                    value="disagree"
                    checked={formData.personalCompanyInfoConsent === 'disagree'}
                    onChange={handleInputChange}
                    className="mt-1 h-5 w-5 border-[#9ebdae] accent-[#3f8657] focus:ring-[#3f8657]/45"
                  />
                  <span className="text-sm text-[#244f3b] sm:text-base">
                    I do NOT allow the upload or use of event photos and videos that may include me for internal or
                    external purposes.
                  </span>
                </label>
              </div>

              {errors.personalCompanyInfoConsent && (
                <p className="mt-3 flex items-center gap-1 text-xs text-[#b64a4a]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.personalCompanyInfoConsent}
                </p>
              )}
            </article>

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
                className="primary-btn px-7 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto md:text-base"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
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
    <div className={className}>
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

function ScaleLegend() {
  return (
    <article className="glass-panel-soft p-4 sm:p-5">
      <p className="text-sm font-semibold text-[#2f5f47] sm:text-base">Rating scale</p>
      <ul className="mt-2 space-y-1 text-sm text-[#355a48] sm:text-base">
        {SATISFACTION_LEGEND.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

type LinearScaleQuestionProps = {
  question: string;
  name: string;
  value: ScaleRating;
  minLabel: string;
  maxLabel: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
};

function LinearScaleQuestion({
  question,
  name,
  value,
  minLabel,
  maxLabel,
  onChange,
  required,
  error
}: LinearScaleQuestionProps) {
  return (
    <article className="glass-panel-soft p-4 sm:p-5">
      <p className="text-base text-[#203d30] sm:text-lg">
        {question}
        {required && <span className="ml-1 text-[#c05b5b]">*</span>}
      </p>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[540px]">
          <div className="grid grid-cols-[120px_repeat(5,1fr)_120px] items-center gap-2 text-center">
            <div />
            {['1', '2', '3', '4', '5'].map((option) => (
              <span key={`${name}-${option}`} className="text-sm text-[#2e5a45]">
                {option}
              </span>
            ))}
            <div />

            <span className="text-left text-sm text-[#2e5a45]">{minLabel}</span>
            {['1', '2', '3', '4', '5'].map((option) => (
              <label key={option} className="inline-flex justify-center">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={onChange}
                  className="h-5 w-5 border-[#9ebdae] accent-[#3f8657] focus:ring-[#3f8657]/45"
                />
              </label>
            ))}
            <span className="text-right text-sm text-[#2e5a45]">{maxLabel}</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-1 text-xs text-[#b64a4a]">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </article>
  );
}

type MatrixQuestionProps = {
  question: string;
  rows: ReadonlyArray<{ key: string; label: string }>;
  options: ReadonlyArray<{ value: string; label: string }>;
  values: Record<string, string>;
  onChange: (rowKey: string, value: string) => void;
  namePrefix: string;
  note?: string;
  required?: boolean;
  error?: string;
};

function MatrixQuestion({
  question,
  rows,
  options,
  values,
  onChange,
  namePrefix,
  note,
  required,
  error
}: MatrixQuestionProps) {
  return (
    <article className="glass-panel-soft p-4 sm:p-5">
      <p className="text-base text-[#203d30] sm:text-lg">
        {question}
        {required && <span className="ml-1 text-[#c05b5b]">*</span>}
      </p>

      {note && <p className="mt-2 text-sm text-[#4a6858]">{note}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[700px] w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-2 text-left text-sm font-semibold text-[#355a48]"> </th>
              {options.map((option) => (
                <th
                  key={`${namePrefix}-${option.value}`}
                  className="px-2 text-center text-sm font-semibold text-[#355a48]"
                >
                  {option.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${namePrefix}-${row.key}`}>
                <td className="rounded-l-lg border border-r-0 border-[#d5e3da] bg-[#f7fcf8] px-3 py-2 text-sm text-[#244f3b]">
                  {row.label}
                </td>
                {options.map((option, index) => {
                  const isFirst = index === 0;
                  const isLast = index === options.length - 1;

                  return (
                    <td
                      key={`${namePrefix}-${row.key}-${option.value}`}
                      className={`border border-[#d5e3da] bg-[#f7fcf8] px-2 py-2 text-center ${
                        isFirst ? 'border-l-0' : ''
                      } ${isLast ? 'rounded-r-lg' : 'border-r-0'}`}
                    >
                      <label className="inline-flex cursor-pointer justify-center">
                        <input
                          type="radio"
                          name={`${namePrefix}-${row.key}`}
                          value={option.value}
                          checked={values[row.key] === option.value}
                          onChange={() => onChange(row.key, option.value)}
                          className="h-5 w-5 border-[#9ebdae] accent-[#3f8657] focus:ring-[#3f8657]/45"
                        />
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-1 text-xs text-[#b64a4a]">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </article>
  );
}

type TextResponseQuestionProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

function TextResponseQuestion({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  error
}: TextResponseQuestionProps) {
  return (
    <article className="glass-panel-soft p-4 sm:p-5">
      <label htmlFor={name} className="text-base text-[#203d30] sm:text-lg">
        {label}
        {required && <span className="ml-1 text-[#c05b5b]">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={2}
        placeholder={placeholder}
        className={`form-input mt-3 resize-y ${error ? 'form-input-error' : ''}`}
      />

      {error && (
        <p className="mt-3 flex items-center gap-1 text-xs text-[#b64a4a]">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </article>
  );
}
