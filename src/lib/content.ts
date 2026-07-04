import { IMG } from './images';

export type Room = {
  id: string;
  image: string;
  price: number; // EUR per night, from
  sizeSqm: number;
  guests: number;
};

export const ROOMS: Room[] = [
  { id: 'deluxe', image: IMG.rooms.deluxe, price: 320, sizeSqm: 42, guests: 2 },
  { id: 'junior', image: IMG.rooms.junior, price: 480, sizeSqm: 58, guests: 3 },
  { id: 'bungalow', image: IMG.rooms.bungalow, price: 720, sizeSqm: 75, guests: 3 },
  { id: 'villa', image: IMG.rooms.villa, price: 1450, sizeSqm: 180, guests: 5 },
];

export type Venue = {
  id: string;
  type: 'restaurant' | 'bar';
  image: string;
};

export const VENUES: Venue[] = [
  { id: 'ostria', type: 'restaurant', image: IMG.dining.ostria },
  { id: 'kyma', type: 'restaurant', image: IMG.dining.kyma },
  { id: 'umi', type: 'restaurant', image: IMG.dining.umi },
  { id: 'meltemi', type: 'bar', image: IMG.dining.meltemi },
  { id: 'aegli', type: 'bar', image: IMG.dining.aegli },
];

export const RESTAURANTS = VENUES.filter((v) => v.type === 'restaurant');
export const BARS = VENUES.filter((v) => v.type === 'bar');

export function getVenue(id: string): Venue | undefined {
  return VENUES.find((v) => v.id === id);
}

export type Experience = {
  id: string;
  image: string;
};

export type Testimonial = {
  id: string;
  image: string;
  rating: number; // out of 5
};

export const TESTIMONIALS: Testimonial[] = [
  { id: 'martin', image: IMG.testimonials.martin, rating: 5 },
  { id: 'weber', image: IMG.testimonials.weber, rating: 5 },
  { id: 'rossi', image: IMG.testimonials.rossi, rating: 5 },
  { id: 'okafor', image: IMG.testimonials.okafor, rating: 5 },
  { id: 'adler', image: IMG.testimonials.adler, rating: 4 },
  { id: 'sullivan', image: IMG.testimonials.sullivan, rating: 5 },
];

export const EXPERIENCES: Experience[] = [
  { id: 'sailing', image: IMG.experiences.sailing },
  { id: 'hiking', image: IMG.experiences.hiking },
  { id: 'overland', image: IMG.experiences.overland },
  { id: 'kayak', image: IMG.experiences.kayak },
  { id: 'coves', image: IMG.experiences.coves },
  { id: 'village', image: IMG.experiences.village },
];

export const HOTEL = {
  name: 'Thalatta Bay Resort & Spa',
  street: 'Aktí Eloúndas 1',
  area: 'Eloúnda 72053',
  region: 'Lasíthi, Crete, Greece',
  phone: '+30 28410 40000',
  email: 'reservations@thalattabay.example',
  lat: 35.2604,
  lng: 25.7242,
};
