import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, DoorOpen, MapPin } from 'lucide-react';
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
  return (
    <section
      className={`glass-panel section-reveal px-3.5 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 ${className}`}
      aria-label="Event details"
    >
      <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2 lg:grid-cols-4">
        {META_ITEMS.map((item, index) => {
          const Icon = item.icon;

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
  );
}