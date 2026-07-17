import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { TripCard, type TripStatus } from '@/components/trips/TripCard';
import { Avatar, Button, EmptyState, Screen, Text } from '@/components/ui';
import { useTheme } from '@/theme';

// Datos de ejemplo para mostrar el diseño — se sustituyen por datos reales en f-001-trip-crud.
const DEMO_TRIPS: Array<{
  id: string;
  destination: string;
  dateRangeLabel: string;
  status: TripStatus;
  bookingsCount: number;
  documentsCount: number;
}> = [
  {
    id: '1',
    destination: 'Kioto, Japón',
    dateRangeLabel: '12 – 24 oct 2026',
    status: 'upcoming',
    bookingsCount: 5,
    documentsCount: 3,
  },
  {
    id: '2',
    destination: 'Lisboa, Portugal',
    dateRangeLabel: '3 – 8 mar 2026',
    status: 'past',
    bookingsCount: 3,
    documentsCount: 2,
  },
];

export default function TripsScreen() {
  const { colors, spacing } = useTheme();
  const hasTrips = DEMO_TRIPS.length > 0;

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Text variant="display">¡Hola, Antonio!</Text>
          <Text variant="subtitle" color="textSecondary">
            Aquí tienes tus viajes
          </Text>
        </View>
        <Avatar name="Antonio Paya" />
      </View>

      {hasTrips ? (
        <View style={{ gap: spacing.md, marginTop: spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="overline" color="textTertiary">
              TUS VIAJES
            </Text>
            <Button
              label="Nuevo"
              size="sm"
              leftIcon={<Ionicons name="add" size={16} color={colors.onPrimary} />}
            />
          </View>

          {DEMO_TRIPS.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="airplane-outline"
          title="Todavía no tienes viajes"
          description="Añade tu primera reserva y empieza a organizar tu próximo viaje."
          actionLabel="Crear viaje"
        />
      )}

      <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.xl, textAlign: 'center' }}>
        Vista de ejemplo — la gestión real de viajes llega en la próxima feature
      </Text>
    </Screen>
  );
}
