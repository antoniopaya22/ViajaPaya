import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';
import { TripStatus } from '@/types/trip';

interface StatusBadgeProps {
  status: TripStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<
  TripStatus,
  {
    label: string;
    color: string;
    backgroundColor: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  upcoming: {
    label: 'Próximo',
    color: Colors.tripUpcoming,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    icon: 'hourglass-outline',
  },
  ongoing: {
    label: 'En curso',
    color: Colors.tripOngoing,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    icon: 'pulse-outline',
  },
  past: {
    label: 'Finalizado',
    color: Colors.tripPast,
    backgroundColor: 'rgba(156, 163, 175, 0.12)',
    icon: 'checkmark-circle-outline',
  },
};

export default function StatusBadge({
  status,
  size = 'sm',
  showIcon = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? Spacing.xs : Spacing.sm - 2,
        },
      ]}
    >
      {showIcon && (
        <Ionicons
          name={config.icon}
          size={isSmall ? 12 : 14}
          color={config.color}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: config.color,
            fontSize: isSmall ? FontSizes.xs : FontSizes.sm,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: Spacing.xs,
  },
  label: {
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.3,
  },
});
