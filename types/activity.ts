export type ActivityType =
  | 'excursion'
  | 'cultural_visit'
  | 'show'
  | 'guided_tour'
  | 'adventure'
  | 'gastronomy'
  | 'nightlife'
  | 'wellness'
  | 'other';

export type PaymentStatus = 'paid' | 'pending' | 'partial';

export interface Activity {
  id: string;
  tripId: string;
  name: string;
  type: ActivityType;
  date: string;           // ISO date YYYY-MM-DD
  startTime?: string;     // HH:mm
  endTime?: string;       // HH:mm
  estimatedDuration?: number; // minutes
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  confirmationCode?: string;
  provider?: string;      // GetYourGuide, Civitatis, etc.
  price?: number;
  currency?: string;
  paymentStatus?: PaymentStatus;
  website?: string;
  meetingPoint?: string;  // For tours with a guide
  isCompleted: boolean;
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

export const ACTIVITY_TYPES: Record<ActivityType, string> = {
  excursion: 'Excursión',
  cultural_visit: 'Visita cultural',
  show: 'Espectáculo',
  guided_tour: 'Tour guiado',
  adventure: 'Aventura / Deporte',
  gastronomy: 'Gastronomía',
  nightlife: 'Vida nocturna',
  wellness: 'Wellness / Spa',
  other: 'Otro',
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  excursion: 'trail-sign',
  cultural_visit: 'library',
  show: 'musical-notes',
  guided_tour: 'flag',
  adventure: 'fitness',
  gastronomy: 'restaurant',
  nightlife: 'moon',
  wellness: 'heart',
  other: 'ellipsis-horizontal',
};

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  excursion: '#48BB78',
  cultural_visit: '#9F7AEA',
  show: '#ED64A6',
  guided_tour: '#4299E1',
  adventure: '#F56565',
  gastronomy: '#ED8936',
  nightlife: '#667EEA',
  wellness: '#38B2AC',
  other: '#A0AEC0',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'Pagado',
  pending: 'Pendiente de pago',
  partial: 'Pago parcial',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  paid: '#48BB78',
  pending: '#ED8936',
  partial: '#ECC94B',
};

export type ActivityFormData = Omit<Activity, 'id' | 'tripId' | 'createdAt' | 'updatedAt'>;

export const getEmptyActivityForm = (type: ActivityType = 'cultural_visit'): ActivityFormData => ({
  name: '',
  type,
  date: '',
  startTime: '',
  endTime: '',
  estimatedDuration: undefined,
  location: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  confirmationCode: '',
  provider: '',
  price: undefined,
  currency: 'EUR',
  paymentStatus: undefined,
  website: '',
  meetingPoint: '',
  isCompleted: false,
  notes: '',
  attachments: [],
});

export const getEstimatedDuration = (activity: Activity): number | undefined => {
  if (activity.estimatedDuration) return activity.estimatedDuration;
  if (activity.startTime && activity.endTime) {
    const [startH, startM] = activity.startTime.split(':').map(Number);
    const [endH, endM] = activity.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    if (endMinutes > startMinutes) {
      return endMinutes - startMinutes;
    }
  }
  return undefined;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const createActivity = (tripId: string, data: ActivityFormData): Activity => {
  const now = new Date().toISOString();
  return {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tripId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
};
