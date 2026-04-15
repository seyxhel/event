export const EVENT_DETAILS = {
  title: 'The Cybersecurity Implementation Journey',
  subtitle: 'From Framework to Reality',
  tagline: 'Learn the framework. Map the controls. Deploy with confidence.',
  dateLong: 'May 12, 2026, Tuesday',
  venue: 'Oasis Manila',
  venueAddress: 'Aurora Blvd, San Juan City',
  eventTime: '9:00 AM - 5:00 PM',
  registrationStarts: '8:00 AM',
  venueMapUrl: 'https://maps.app.goo.gl/CkETdCVNr9bXrJAy7',
  venueMapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.7342027177297!2d121.02823407487296!3d14.612659985875135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b62d0b68fa0d%3A0xc33c19bd640d488b!2sOasis%20Manila!5e1!3m2!1sen!2sph!4v1776269473685!5m2!1sen!2sph',
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