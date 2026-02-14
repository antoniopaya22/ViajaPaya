export type AccommodationType =
  | 'hotel'
  | 'apartment'
  | 'hostel'
  | 'camping'
  | 'rural_house'
  | 'airbnb'
  | 'resort'
  | 'cruise'
  | 'campervan'
  | 'friends_family'
  | 'other';

export interface Accommodation {
  id: string;
  tripId: string;
  name: string;
  type: AccommodationType;
  customType?: string; // When type is 'other'
  checkInDate: string;  // ISO datetime
  checkOutDate: string; // ISO datetime
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  confirmationCode?: string;
  website?: string;
  totalPrice?: number;
  currency?: string;
  roomNumber?: string;
  contactPerson?: string;
  arrivalInstructions?: string;
  parkingInfo?: string;
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

export const ACCOMMODATION_TYPES: Record<AccommodationType, string> = {
  hotel: 'Hotel',
  apartment: 'Apartamento',
  hostel: 'Hostal',
  camping: 'Camping',
  rural_house: 'Casa rural',
  airbnb: 'Airbnb',
  resort: 'Resort',
  cruise: 'Crucero',
  campervan: 'Autocaravana',
  friends_family: 'Casa de amigos/familia',
  other: 'Otro',
};

export const ACCOMMODATION_ICONS: Record<AccommodationType, string> = {
  hotel: 'business',
  apartment: 'home',
  hostel: 'bed',
  camping: 'bonfire',
  rural_house: 'leaf',
  airbnb: 'key',
  resort: 'umbrella',
  cruise: 'boat',
  campervan: 'car',
  friends_family: 'people',
  other: 'ellipsis-horizontal',
};

export const ACCOMMODATION_COLORS: Record<AccommodationType, string> = {
  hotel: '#9F7AEA',
  apartment: '#4299E1',
  hostel: '#ED8936',
  camping: '#48BB78',
  rural_house: '#38A169',
  airbnb: '#F56565',
  resort: '#D69E2E',
  cruise: '#0BC5EA',
  campervan: '#718096',
  friends_family: '#E53E3E',
  other: '#A0AEC0',
};

export type AccommodationFormData = Omit<Accommodation, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>;

export const getEmptyAccommodationForm = (type: AccommodationType = 'hotel'): AccommodationFormData => ({
  name: '',
  type,
  customType: '',
  checkInDate: '',
  checkOutDate: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  phone: '',
  email: '',
  confirmationCode: '',
  website: '',
  totalPrice: undefined,
  currency: 'EUR',
  roomNumber: '',
  contactPerson: '',
  arrivalInstructions: '',
  parkingInfo: '',
  notes: '',
  attachments: [],
});

export const getAccommodationNights = (accommodation: Accommodation): number => {
  const checkIn = new Date(accommodation.checkInDate);
  const checkOut = new Date(accommodation.checkOutDate);
  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

export const createAccommodation = (tripId: string, data: AccommodationFormData): Accommodation => {
  const now = new Date().toISOString();
  return {
    id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tripId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};
