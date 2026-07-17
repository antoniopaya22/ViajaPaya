import { View } from 'react-native';

import { TripCard, type TripStatus } from '@/components/trips/TripCard';
import { Button, EmptyState, Header, Screen, Text } from '@/components/ui';
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
  const { spacing } = useTheme();
  const hasTrips = DEMO_TRIPS.length > 0;

  return (
    <Screen scroll>
      <Header title="Tus viajes" subtitle="Todo lo que ya tienes reservado" />

      {hasTrips ? (
        <View style={{ gap: spacing.md, marginTop: spacing.xs }}>
          {DEMO_TRIPS.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}

          <Button label="Añadir viaje" variant="secondary" fullWidth />
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
