export type TripStatus = 'upcoming' | 'ongoing' | 'past';

export interface Trip {
  id: string;
  userId: string;
  name: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripInput {
  name: string;
  destinations: string[];
  startDate: string;
  endDate: string;
}
