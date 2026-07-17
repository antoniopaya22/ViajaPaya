import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/contexts/AuthProvider';
import { TripCard } from '@/components/trips/TripCard';
import { Avatar, Button, EmptyState, Screen, Text } from '@/components/ui';
import { useTrips } from '@/hooks/useTrips';
import { useTheme } from '@/theme';
import { formatDateRange, getTripStatus } from '@/utils/trip';
import { displayNameFromEmail } from '@/utils/user';

export default function TripsScreen() {
  const { colors, spacing } = useTheme();
  const { user } = useAuth();
  const { trips, loading, error, refresh } = useTrips();
  const name = user?.email ? displayNameFromEmail(user.email) : '';

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Text variant="display">{name ? `¡Hola, ${name}!` : '¡Hola!'}</Text>
          <Text variant="subtitle" color="textSecondary">
            Aquí tienes tus viajes
          </Text>
        </View>
        <Avatar name={name || '?'} />
      </View>

      {loading ? (
        <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error ? (
        <Text variant="body" color="danger" style={{ marginTop: spacing.md }}>
          {error}
        </Text>
      ) : trips.length > 0 ? (
        <View style={{ gap: spacing.md, marginTop: spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="overline" color="textTertiary">
              TUS VIAJES
            </Text>
            <Button
              label="Nuevo"
              size="sm"
              leftIcon={<Ionicons name="add" size={16} color={colors.onPrimary} />}
              onPress={() => router.push('/trip/new')}
            />
          </View>

          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              destination={trip.destination}
              dateRangeLabel={formatDateRange(trip.startDate, trip.endDate)}
              status={getTripStatus(trip.startDate, trip.endDate)}
              bookingsCount={0}
              documentsCount={0}
              onPress={() => router.push({ pathname: '/trip/[id]', params: { id: trip.id } })}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="airplane-outline"
          title="Todavía no tienes viajes"
          description="Añade tu primera reserva y empieza a organizar tu próximo viaje."
          actionLabel="Crear viaje"
          onAction={() => router.push('/trip/new')}
        />
      )}
    </Screen>
  );
}
