import { Trip } from '@/types';
import { toISODate } from '@/utils/date';

// Datos de ejemplo para inicializar la aplicación (solo se usan la primera vez)
export const getInitialTrips = (): Trip[] => [
  {
    id: '1',
    name: 'Vacaciones en París',
    destination: 'París, Francia',
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    bookings: [
      {
        id: '1',
        type: 'flight',
        name: 'Vuelo a París',
        location: 'Aeropuerto Charles de Gaulle',
        date: '2024-06-15',
        time: '08:30',
        confirmationNumber: 'AF123',
      },
      {
        id: '2',
        type: 'hotel',
        name: 'Hotel Le Marais',
        location: 'Rue de Rivoli, París',
        date: '2024-06-15',
        time: '15:00',
        confirmationNumber: 'HTL456',
      },
    ],
    placesOfInterest: [
      {
        id: '1',
        name: 'Torre Eiffel',
        location: 'Campo de Marte, París',
        description: 'Icónica torre de hierro y símbolo de París',
        visited: false,
      },
      {
        id: '2',
        name: 'Museo del Louvre',
        location: 'Rue de Rivoli, París',
        description: 'El museo de arte más grande del mundo',
        visited: false,
      },
    ],
  },
    {
    id: '2',
    name: 'Aventura en Tokio',
    destination: 'Tokio, Japón',
    startDate: '2024-07-01',
    endDate: '2024-07-10',
    bookings: [
    ],
    placesOfInterest: [
    ],
    },
];

// Función para crear un nuevo viaje
export const createNewTrip = (name: string, destination?: string): Trip => {
  const today = new Date();
  const nextWeek = new Date(today.getTime());
  nextWeek.setDate(today.getDate() + 7);

  return {
    id: Date.now().toString(),
    name,
    destination: destination || 'Destino por definir',
  startDate: toISODate(today),
  endDate: toISODate(nextWeek),
    bookings: [],
    placesOfInterest: [],
  };
};

// Función para obtener sugerencias de destinos populares
export const getPopularDestinations = (): string[] => [
  'París, Francia',
  'Tokio, Japón',
  'Nueva York, Estados Unidos',
  'Londres, Reino Unido',
  'Roma, Italia',
  'Barcelona, España',
  'Amsterdam, Países Bajos',
  'Dubai, Emiratos Árabes Unidos',
  'Sydney, Australia',
  'Bangkok, Tailandia',
  'Singapur',
  'Rio de Janeiro, Brasil',
  'Buenos Aires, Argentina',
  'México DF, México',
  'Lima, Perú',
  'Cusco, Perú',
  'Santiago, Chile',
  'Bogotá, Colombia',
  'Nairobi, Kenya',
  'Cairo, Egipto',
];

// Función para validar formato de fecha
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Función para formatear fecha para mostrar
export const formatDateForDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};
