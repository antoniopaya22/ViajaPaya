import { TravelColors } from '@/constants/Colors';
import { BookingType } from '@/types';

export const bookingIcon: Record<BookingType, string> = {
  flight: 'airplane',
  hotel: 'bed',
  transport: 'car',
  activity: 'ticket',
};

export const bookingColor: Record<BookingType, string> = {
  flight: TravelColors.primary,
  hotel: TravelColors.error,
  transport: TravelColors.success,
  activity: TravelColors.warning,
};
