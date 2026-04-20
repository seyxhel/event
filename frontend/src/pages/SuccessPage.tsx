import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Cpu,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { EVENT_DETAILS } from '../eventDetails';

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

export function SuccessPage() {
  const location = useLocation();
  const exportReceiptRef = React.useRef<HTMLElement | null>(null);

  const state = (location.state as {
    mode?: 'registration' | 'feedback';
    firstName?: string;
    lastName?: string;
    email?: string;
    refNumber?: string;
    submittedAt?: string;
  }) || null;

  const isFeedback = state?.mode !== 'registration';

  const thankYouTitle = isFeedback ? 'Thank You for Your Feedback' : 'Thank You for Registering';
  const thankYouMessage = isFeedback
    ? 'Thank you for completing the feedback form. Your insights help us improve future events, sessions, and logistics.'
    : 'We are excited to welcome you at the event. Your registration has been recorded successfully.';
  const thankYouNextStep = isFeedback
    ? 'Please keep your reference number for any follow-up from our organizing team.'
    : 'Please save your reference number and keep this confirmation page for event day check-in.';

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
              <Network className="icon-blink h-4 w-4 text-[#366aa1]" />
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

      <div className="relative z-10 mx-auto mt-5 max-w-4xl px-3 sm:mt-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="glass-panel section-reveal relative overflow-hidden p-4 sm:p-7 md:p-10"
        >
          <div className="pointer-events-none absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#b9923d] via-[#3f8657] to-[#b9923d]" />

          <div className="mb-6 sm:mb-8">
            <CheckCircle2 className="soft-float mx-auto mb-4 h-16 w-16 text-[#3f8657] sm:h-20 sm:w-20" />
            <div className="mx-auto w-full max-w-3xl">
              <h1 className="display-font text-center text-3xl text-[#1f4736] sm:text-4xl md:text-5xl">
                {isFeedback ? 'Feedback Submitted' : 'Registration Successful'}
              </h1>
            </div>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[#5f7568] md:text-base">
              {isFeedback
                ? 'Thank you for completing the feedback form.'
                : `Thank you for registering for ${EVENT_DETAILS.title}: ${EVENT_DETAILS.subtitle}.`}
            </p>
          </div>

          <article className="glass-panel-soft mt-6 rounded-xl border border-[#b8d4c4] bg-[#f4faf6] p-4 sm:mt-7 sm:p-5">
            <h2 className="display-font text-xl text-[#1f4736] sm:text-2xl">{thankYouTitle}</h2>
            <p className="mt-2 text-sm text-[#325846] md:text-base">{thankYouMessage}</p>
            <p className="mt-2 text-sm text-[#4e6b5c] md:text-base">{thankYouNextStep}</p>
          </article>

        </motion.section>
      </div>

      <div className="pointer-events-none fixed left-[-10000px] top-0 w-[960px] overflow-hidden opacity-100" aria-hidden="true">
        <section
          ref={exportReceiptRef}
          className="relative overflow-hidden rounded-[1rem] border border-[#cfddd2] bg-[#ffffff] p-4 text-left shadow-none"
          style={{ color: '#214736' }}
        >
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#b9923d] via-[#3f8657] to-[#b9923d]" />

          <div className="mb-6 sm:mb-8">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[#3f8657] sm:h-20 sm:w-20" />
            <div className="mx-auto w-full max-w-3xl">
              <h1 className="display-font text-center text-3xl text-[#1f4736] sm:text-4xl md:text-5xl">
                {isFeedback ? 'Feedback Submitted' : 'Registration Successful'}
              </h1>
            </div>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[#5f7568] md:text-base">
              {isFeedback
                ? 'Thank you for completing the feedback form.'
                : `Thank you for registering for ${EVENT_DETAILS.title}: ${EVENT_DETAILS.subtitle}.`}
            </p>
          </div>

          <article className="glass-panel-soft mt-6 rounded-xl border border-[#b8d4c4] bg-[#f4faf6] p-4 sm:mt-7 sm:p-5">
            <h2 className="display-font text-xl text-[#1f4736] sm:text-2xl">{thankYouTitle}</h2>
            <p className="mt-2 text-sm text-[#325846] md:text-base">{thankYouMessage}</p>
            <p className="mt-2 text-sm text-[#4e6b5c] md:text-base">{thankYouNextStep}</p>
          </article>

        </section>
      </div>
    </div>
  );
}
