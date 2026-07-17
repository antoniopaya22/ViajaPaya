import { getTripStatus } from '@/utils/trip';

describe('getTripStatus', () => {
  const now = new Date(2026, 6, 17); // 2026-07-17

  it('devuelve upcoming si el viaje empieza después de hoy', () => {
    expect(getTripStatus('2026-08-01', '2026-08-10', now)).toBe('upcoming');
  });

  it('devuelve past si el viaje terminó antes de hoy', () => {
    expect(getTripStatus('2026-03-01', '2026-03-10', now)).toBe('past');
  });

  it('devuelve ongoing si hoy cae dentro del rango', () => {
    expect(getTripStatus('2026-07-10', '2026-07-20', now)).toBe('ongoing');
  });
});
