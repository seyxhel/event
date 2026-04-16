import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Hash,
  Mail,
  Network,
  ShieldCheck,
  User
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
  const [currentDate, setCurrentDate] = useState('');
  const [copied, setCopied] = useState(false);

  const state = (location.state as {
    firstName?: string;
    lastName?: string;
    email?: string;
    refNumber?: string;
  }) || null;

  const fullName =
    state?.firstName && state?.lastName ? `${state.firstName} ${state.lastName}` : 'Guest';
  const email = state?.email || 'Not provided';
  const refNumber = state?.refNumber || 'MAP-XXXX-XXXX';

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    );
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCopied(false);
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(refNumber);
      setCopied(true);
    } catch {
      setCopied(false);
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

          <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
            <CheckCircle2 className="soft-float mb-4 h-16 w-16 text-[#3f8657] sm:h-20 sm:w-20" />
            <h1 className="display-font text-3xl text-[#1f4736] sm:text-4xl md:text-5xl">
              Registration Successful
            </h1>
            <p className="mt-3 max-w-xl text-sm text-[#5f7568] md:text-base">
              Thank you for registering for {EVENT_DETAILS.title}: {EVENT_DETAILS.subtitle}.
            </p>
          </div>

          <article className="glass-panel-soft rounded-xl p-4 sm:p-5 md:p-6">
            <h3 className="form-label mb-4">Registration Details</h3>

            <div className="space-y-3 text-sm sm:space-y-4 md:text-base">
              <DetailBlock
                icon={<Hash className="h-5 w-5 text-[#b9923d]" />}
                label="Reference Number"
                value={refNumber}
                extra={
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="secondary-btn mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Ref
                      </>
                    )}
                  </button>
                }
              />

              <DetailBlock
                icon={<User className="h-5 w-5 text-[#b9923d]" />}
                label="Registrant Name"
                value={fullName}
              />

              <DetailBlock
                icon={<Mail className="h-5 w-5 text-[#b9923d]" />}
                label="Email Address"
                value={email}
              />

              <DetailBlock
                icon={<Calendar className="h-5 w-5 text-[#b9923d]" />}
                label="Registration Date"
                value={currentDate}
              />
            </div>
          </article>

          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.32 }}
            className="glass-panel-soft hover-lift mt-6 rounded-xl border border-[#e0c27a] bg-[#fff7e8] p-4 sm:mt-7 sm:p-5"
          >
            <h2 className="display-font text-xl text-[#7b5a1b] sm:text-2xl">Important Notes</h2>
            <ul className="mt-3 space-y-2 text-left text-sm text-[#6e5320] md:text-base">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#b9923d]" />
                Bring either your Company ID or one valid ID on event day.
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#b9923d]" />
                Please keep your email confirmation as proof of registration.
              </li>
              <li className="flex items-start gap-2">
                <Camera className="mt-0.5 h-4 w-4 shrink-0 text-[#b9923d]" />
                Take a screenshot of this successful registration page and present it at the entrance.
              </li>
            </ul>
          </motion.article>

          <div className="mt-6 text-center sm:mt-8">
            <Link to="/" className="ghost-link text-sm font-semibold md:text-base">
              Register Another Person
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

type DetailBlockProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra?: React.ReactNode;
};

function DetailBlock({ icon, label, value, extra }: DetailBlockProps) {
  return (
    <div className="rounded-lg border border-[#cfded3] bg-[#f7fbf8] p-3 sm:p-3.5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          <p className="form-label text-[0.72rem] text-[#5f7568]">{label}</p>
          <p className="mt-1 break-words text-[#214736]">{value}</p>
          {extra}
        </div>
      </div>
    </div>
  );
}
