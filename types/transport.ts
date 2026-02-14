export type TransportType =
  | 'flight'
  | 'train'
  | 'bus'
  | 'ferry'
  | 'car_rental'
  | 'transfer'
  | 'other';

export interface Transport {
  id: string;
  tripId: string;
  type: TransportType;
  origin: string;
  destination: string;
  departureDate: string;   // ISO datetime
  arrivalDate?: string;    // ISO datetime
  company?: string;        // Airline, rail company, bus company, etc.
  referenceCode?: string;  // Booking locator / confirmation code
  serviceNumber?: string;  // Flight number, train number, line, etc.
  seatNumber?: string;
  vehicleNumber?: string;  // Coach, terminal, cabin, etc.
  travelClass?: string;    // Economy, business, first, etc.
  gate?: string;           // Boarding gate (flights)
  // Car rental specific
  pickupLocation?: string;
  dropoffLocation?: string;
  vehicleCategory?: string;
  licensePlate?: string;
  insurancePolicy?: string;
  assistancePhone?: string;
  // Transfer specific
  driverName?: string;
  driverPhone?: string;
  meetingPoint?: string;
  // Cost
  cost?: number;
  currency?: string;
  // Extra
  notes?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  uri: string;
  type: 'image' | 'pdf';
  createdAt: string;
}

export const TRANSPORT_TYPES: Record<TransportType, string> = {
  flight: 'Vuelo',
  train: 'Tren',
  bus: 'Autobús',
  ferry: 'Ferry',
  car_rental: 'Coche de alquiler',
  transfer: 'Traslado',
  other: 'Otro',
};

export const TRANSPORT_ICONS: Record<TransportType, string> = {
  flight: 'airplane',
  train: 'train',
  bus: 'bus',
  ferry: 'boat',
  car_rental: 'car',
  transfer: 'car-sport',
  other: 'swap-horizontal',
};

export const TRANSPORT_COLORS: Record<TransportType, string> = {
  flight: '#4299E1',
  train: '#48BB78',
  bus: '#ED8936',
  ferry: '#0BC5EA',
  car_rental: '#9F7AEA',
  transfer: '#F56565',
  other: '#A0AEC0',
};

export const TRAVEL_CLASSES = [
  'Turista',
  'Turista Premium',
  'Business',
  'Primera',
] as const;

export type TransportFormData = Omit<Transport, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>;

export const getEmptyTransportForm = (type: TransportType = 'flight'): TransportFormData => ({
  type,
  origin: '',
  destination: '',
  departureDate: '',
  arrivalDate: '',
  company: '',
  referenceCode: '',
  serviceNumber: '',
  seatNumber: '',
  vehicleNumber: '',
  travelClass: '',
  gate: '',
  pickupLocation: '',
  dropoffLocation: '',
  vehicleCategory: '',
  licensePlate: '',
  insurancePolicy: '',
  assistancePhone: '',
  driverName: '',
  driverPhone: '',
  meetingPoint: '',
  cost: undefined,
  currency: 'EUR',
  notes: '',
  attachments: [],
});

export const createTransport = (tripId: string, data: TransportFormData): Transport => {
  const now = new Date().toISOString();
  return {
    id: `transport_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tripId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};
