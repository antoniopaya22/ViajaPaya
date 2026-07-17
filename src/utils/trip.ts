import type { TripStatus } from '@/types/trip';

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTripStatus(startDate: string, endDate: string, now: Date = new Date()): TripStatus {
  const today = now.toISOString().slice(0, 10);
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'past';
  return 'ongoing';
}

export function formatDateRange(startDate: string, endDate: string): string {
  const format = (iso: string) => parseIsoDate(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const endYearLabel = parseIsoDate(endDate).toLocaleDateString('es-ES', { year: 'numeric' });
  return `${format(startDate)} – ${format(endDate)} ${endYearLabel}`;
}
