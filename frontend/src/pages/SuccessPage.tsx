import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Hash,
  Mail,
  User
} from 'lucide-react';
import { ScrollFadeBanner } from '../components/ScrollFadeBanner';
import { EVENT_DETAILS } from '../eventDetails';

const BANNER_URL = '/event-banner.jpeg';

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
    <div className="min-h-screen pb-14 sm:pb-16">
      <ScrollFadeBanner
        src={BANNER_URL}
        alt={EVENT_DETAILS.shortName}
        maxHeightClassName="max-h-[34vh]"
        maxHeightVh={34}
        fadeDistance={320}
      />

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

          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.32 }}
            className="glass-panel-soft hover-lift mb-6 flex flex-col items-center rounded-xl p-4 text-center sm:mb-7 sm:p-5"
          >
            <Camera className="mb-2 h-8 w-8 text-[#b9923d]" />
            <h2 className="display-font text-xl text-[#214736] sm:text-2xl">Important Next Step</h2>
            <p className="mt-2 text-sm text-[#5f7568] md:text-base">
              Please take a screenshot of this page and present it at the entrance.
            </p>
          </motion.article>

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
