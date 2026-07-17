export type TripStatus = 'upcoming' | 'ongoing' | 'past';

export interface Trip {
  id: string;
  userId: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetTotal: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripInput {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetTotal: number | null;
}
