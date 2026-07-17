import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Badge, Card, Text } from '@/components/ui';
import { useTheme } from '@/theme';
import type { BadgeVariant } from '@/components/ui/Badge';

export type TripStatus = 'upcoming' | 'ongoing' | 'past';

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

  return (
    <Card variant="elevated" padding={0} onPress={onPress} style={{ overflow: 'hidden' }}>
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.lg, gap: spacing.xxs }}
      >
        <Text variant="h2" style={{ color: colors.onPrimary }}>
          {destination}
        </Text>
        <Text variant="subtitle" style={{ color: colors.onPrimary, opacity: 0.85 }}>
          {dateRangeLabel}
        </Text>
      </LinearGradient>

      <View style={{ padding: spacing.md, gap: spacing.sm }}>
        <Badge label={STATUS_LABEL[status]} variant={STATUS_VARIANT[status]} />

        <View style={{ flexDirection: 'row', gap: spacing.lg }}>
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
        </View>
      </View>
    </Card>
  );
}
