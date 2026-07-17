import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/theme';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TripStatus } from '@/types/trip';

export type { TripStatus };

const STATUS_LABEL: Record<TripStatus, string> = {
  upcoming: 'Próximo',
  ongoing: 'En curso',
  past: 'Finalizado',
};

const STATUS_VARIANT: Record<TripStatus, BadgeVariant> = {
  upcoming: 'info',
  ongoing: 'success',
  past: 'neutral',
};

export interface TripCardProps {
  destination: string;
  dateRangeLabel: string;
  status: TripStatus;
  bookingsCount: number;
  documentsCount: number;
  onPress?: () => void;
}

export function TripCard({ destination, dateRangeLabel, status, bookingsCount, documentsCount, onPress }: TripCardProps) {
  const { colors, radius, spacing } = useTheme();
  const statusVariant = STATUS_VARIANT[status];
  const statusColor = colors[statusVariant === 'neutral' ? 'textSecondary' : statusVariant];

  return (
    <Card variant="elevated" padding={0} onPress={onPress} style={{ overflow: 'hidden' }}>
      <LinearGradient
        colors={[colors.gradientFrom, colors.gradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: 148, padding: spacing.md, overflow: 'hidden' }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: 'rgba(255,255,255,0.14)',
            top: -70,
            right: -40,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: 'rgba(255,255,255,0.10)',
            bottom: -50,
            right: 30,
          }}
        />

        <View
          style={{
            position: 'absolute',
            top: spacing.md,
            right: spacing.md,
            backgroundColor: 'rgba(255,255,255,0.22)',
            borderRadius: radius.pill,
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
          }}
        >
          <Text variant="caption" style={{ color: colors.onPrimary }}>
            {STATUS_LABEL[status]}
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="location" size={16} color={colors.onPrimary} />
            <Text variant="h1" style={{ color: colors.onPrimary }} numberOfLines={1}>
              {destination}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="calendar-outline" size={14} color={colors.onPrimary} style={{ opacity: 0.9 }} />
            <Text variant="subtitle" style={{ color: colors.onPrimary, opacity: 0.9 }}>
              {dateRangeLabel}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={{ flexDirection: 'row', padding: spacing.md, gap: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xxs }}>
          <Ionicons name="briefcase-outline" size={16} color={colors.textSecondary} />
          <Text variant="bodySmall" color="textSecondary">
            {bookingsCount} reservas
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xxs }}>
          <Ionicons name="document-outline" size={16} color={colors.textSecondary} />
          <Text variant="bodySmall" color="textSecondary">
            {documentsCount} documentos
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, marginLeft: 'auto' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor }} />
        </View>
      </View>
    </Card>
  );
}
