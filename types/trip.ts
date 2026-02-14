import { Transport } from './transport';
import { Accommodation } from './accommodation';
import { Activity } from './activity';
import { Expense } from './expense';
import { ChecklistItem } from './checklist';
import { Note } from './note';

export type TripStatus = 'upcoming' | 'ongoing' | 'past';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  description?: string;
  coverImage?: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;   // ISO date string YYYY-MM-DD
  budget?: number;
  budgetCurrency?: string;
  transports: Transport[];
  accommodations: Accommodation[];
  activities: Activity[];
  expenses: Expense[];
  checklist: ChecklistItem[];
  notes: Note[];
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type TripFormData = Omit<
  Trip,
  'id' | 'transports' | 'accommodations' | 'activities' | 'expenses' | 'checklist' | 'notes' | 'createdAt' | 'updatedAt'
>;

export const getEmptyTripFormData = (): TripFormData => ({
  name: '',
  destination: '',
  description: '',
  coverImage: '',
  startDate: '',
  endDate: '',
  budget: undefined,
  budgetCurrency: 'EUR',
});

export const getTripStatus = (trip: Trip): TripStatus => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(trip.endDate);
  end.setHours(23, 59, 59, 999);

  if (now < start) return 'upcoming';
  if (now > end) return 'past';
  return 'ongoing';
};

export const getTripDurationDays = (trip: Trip): number => {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

export const getDaysUntilTrip = (trip: Trip): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);
  return Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const getCurrentDayOfTrip = (trip: Trip): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

export const createTrip = (data: TripFormData): Trip => {
  const now = new Date().toISOString();
  return {
    id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    transports: [],
    accommodations: [],
    activities: [],
    expenses: [],
    checklist: [],
    notes: [],
    createdAt: now,
    updatedAt: now,
  };
};
