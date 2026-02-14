// Utilidades de fecha reutilizables
// Mantener libres de dependencias de React

export const todayISO = (): string => {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().split('T')[0];
};

export const addDays = (date: Date | string, days: number): Date => {
  const base = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  base.setDate(base.getDate() + days);
  return base;
};

export const toISODate = (date: Date): string => date.toISOString().split('T')[0];

export const isAfter = (a: string, b: string): boolean => new Date(a).getTime() > new Date(b).getTime();

export const isValidISODate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = new Date(value).getTime();
  return !isNaN(time);
};

export const formatDateShortES = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
};
