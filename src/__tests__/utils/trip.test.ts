import { formatDestinations, getTripStatus } from '@/utils/trip';

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

describe('formatDestinations', () => {
  it('une hasta 2 destinos con coma', () => {
    expect(formatDestinations(['Kioto', 'Osaka'])).toBe('Kioto, Osaka');
  });

  it('muestra los 2 primeros y +N en vez de cortar el texto', () => {
    expect(formatDestinations(['Kioto', 'Osaka', 'Tokio', 'Nara'])).toBe('Kioto, Osaka +2');
  });

  it('funciona con un único destino', () => {
    expect(formatDestinations(['Kioto'])).toBe('Kioto');
  });
});
