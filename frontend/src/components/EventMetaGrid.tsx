import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, DoorOpen, ExternalLink, MapPin, X } from 'lucide-react';
import { EVENT_DETAILS } from '../eventDetails';

type MetaItem = {
  label: string;
  value: string;
  note?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const META_ITEMS: MetaItem[] = [
  {
    label: 'Date',
    value: EVENT_DETAILS.dateLong,
    icon: CalendarDays
  },
  {
    label: 'Venue',
    value: EVENT_DETAILS.venue,
    note: EVENT_DETAILS.venueAddress,
    icon: MapPin
  },
  {
    label: 'Event Time',
    value: EVENT_DETAILS.eventTime,
    icon: Clock3
  },
  {
    label: 'Registration Starts',
    value: EVENT_DETAILS.registrationStarts,
    icon: DoorOpen
  }
];

const META_CARD_TONES = [
  'from-[#eefaf0] via-[#f8fdf8] to-[#edf9f1] border-[#bfdcc8]',
  'from-[#eef6ff] via-[#f6fbff] to-[#eef9ff] border-[#c5d8ee]',
  'from-[#fff7ec] via-[#fffaf3] to-[#f5ffec] border-[#e4d3ac]',
  'from-[#eff9ff] via-[#f3fcff] to-[#f1fff6] border-[#bfd8df]'
];

type EventMetaGridProps = {
  className?: string;
};

export function EventMetaGrid({ className = '' }: EventMetaGridProps) {
  const [isVenuePreviewOpen, setIsVenuePreviewOpen] = useState(false);

  useEffect(() => {
    if (!isVenuePreviewOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVenuePreviewOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isVenuePreviewOpen]);

  const venuePreviewModal =
    isVenuePreviewOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#10281e]/52 p-2 backdrop-blur-[4px] sm:p-3"
            onClick={() => setIsVenuePreviewOpen(false)}
            role="presentation"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.16),transparent_62%)]"
            />

            <section
              className="glass-panel relative z-10 max-h-[84vh] w-full max-w-[680px] overflow-y-auto p-2.5 sm:p-3.5"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Venue location preview"
            >
              <header className="mb-2 flex items-center justify-between gap-3 border-b border-[#cadbcf]/90 pb-2">
                <div>
                  <p className="meta-badge inline-flex">Venue Preview</p>
                  <h3 className="display-font mt-1.5 text-lg text-[#1f4736] sm:text-xl">{EVENT_DETAILS.venue}</h3>
                  <p className="text-[0.7rem] text-[#5f7568] sm:text-xs">{EVENT_DETAILS.venueAddress}</p>
                </div>
                <button
                  type="button"
                  className="secondary-btn p-2"
                  onClick={() => setIsVenuePreviewOpen(false)}
                  aria-label="Close map preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <div className="overflow-hidden rounded-xl border border-[#cadbcf]/90">
                <div className="h-[210px] sm:h-[240px] md:h-[260px]">
                  <iframe
                    src={EVENT_DETAILS.venueMapEmbedUrl}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Oasis Manila Map"
                    className="h-full w-full"
                  />
                </div>
              </div>

              <a
                href={EVENT_DETAILS.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2f5f47] underline decoration-[#a8c2b3] underline-offset-2 hover:text-[#1f4736]"
              >
                Open full map
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </section>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <section
        className={`glass-panel section-reveal px-3.5 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 ${className}`}
        aria-label="Event details"
      >
        <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2 lg:grid-cols-4">
          {META_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isVenue = item.label === 'Venue';

            if (isVenue) {
              return (
                <motion.button
                  key={item.label}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.32, delay: index * 0.05 }}
                  onClick={() => setIsVenuePreviewOpen(true)}
                  className={`hover-lift rounded-xl border bg-gradient-to-br px-2.5 py-2 text-left outline-none transition hover:border-[#b9923d]/60 focus-visible:ring-2 focus-visible:ring-[#b9923d]/45 sm:px-3 ${META_CARD_TONES[index % META_CARD_TONES.length]}`}
                  aria-label={`Preview map for ${item.value}`}
                >
                  <p className="meta-badge mb-2 inline-flex items-center gap-1.5">
                    <span
                      className="icon-blink inline-flex"
                      style={{ animationDelay: `${0.15 * index}s` }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {item.label}
                  </p>
                  <p className="text-[0.82rem] font-semibold text-[#244c3a] sm:text-sm md:text-base">
                    {item.value}
                  </p>
                  {item.note && <p className="mt-1 text-xs text-[#607769]">{item.note}</p>}
                  <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#8b6a22]">
                    Click to preview map
                  </p>
                </motion.button>
              );
            }

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.32, delay: index * 0.05 }}
                className={`hover-lift rounded-xl border bg-gradient-to-br px-2.5 py-2 sm:px-3 ${META_CARD_TONES[index % META_CARD_TONES.length]}`}
              >
                <p className="meta-badge mb-2 inline-flex items-center gap-1.5">
                  <span
                    className="icon-blink inline-flex"
                    style={{ animationDelay: `${0.15 * index}s` }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {item.label}
                </p>
                <p className="text-[0.82rem] font-semibold text-[#244c3a] sm:text-sm md:text-base">
                  {item.value}
                </p>
                {item.note && (
                  <p className="mt-1 text-xs text-[#607769]">{item.note}</p>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>

      {venuePreviewModal}
    </>
  );
}