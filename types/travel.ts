export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUri?: string;
  bookings: Booking[];
  placesOfInterest: PlaceOfInterest[];
}

export interface Booking {
  id: string;
  type: BookingType;
  name: string;
  location: string;
  date: string;
  time: string;
  confirmationNumber?: string;
  notes?: string;
}

export type BookingType = 'flight' | 'hotel' | 'transport' | 'activity';

export interface PlaceOfInterest {
  id: string;
  name: string;
  location: string;
  description?: string;
  visited: boolean;
  rating?: number;
  notes?: string;
}

export const BOOKING_TYPES = {
  flight: 'Vuelo',
  hotel: 'Hotel',
  transport: 'Transporte',
  activity: 'Actividad',
} as const;
