export const EVENT_DETAILS = {
  title: 'The Cybersecurity Implementation Journey',
  subtitle: 'From Framework to Reality',
  tagline: 'Learn the framework. Map the controls. Deploy with confidence.',
  dateLong: 'May 12, 2026, Tuesday',
  venue: 'Oasis Manila',
  venueAddress: 'Aurora Blvd, San Juan City',
  eventTime: '9:00 AM - 5:00 PM',
  registrationStarts: '8:00 AM',
  officeLandline: '(02) 8800-5399',
  officeEmail: 'sales@maptechisi.com',
  shortName: 'Cybersecurity Implementation Journey'
} as const;

export type EventContact = {
  name: string;
  phone: string;
};

export const EVENT_CONTACTS: EventContact[] = [
  { name: 'Ms. Prud De Leon', phone: '0956-396-1012' },
  { name: 'Mr. Edar Bernardo', phone: '0999-227-9291' },
  { name: 'Mr. Ralph Rivera', phone: '0917-182-8320' },
  { name: 'Mr. Daniel Castillo', phone: '0917-148-2857' }
];