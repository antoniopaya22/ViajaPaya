import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from '@/constants/theme';
import { TripStatus } from '@/types/trip';

interface CountdownBadgeProps {
  /** Number of days (positive = days until, negative = days ago) */
  days: number;
  /** Current status of the trip */
  status: TripStatus;
  /** Current day of trip / total days (for ongoing trips) */
  currentDay?: number;
  totalDays?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export default function CountdownBadge({
  days,
  status,
  currentDay,
  totalDays,
  size = 'md',
}: CountdownBadgeProps) {
  const config = getConfig(status, days, currentDay, totalDays);
  const sizeStyles = SIZE_STYLES[size];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor },
        sizeStyles.container,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={sizeStyles.iconSize}
        color={config.color}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          { color: config.color, fontSize: sizeStyles.fontSize },
        ]}
        numberOfLines={1}
      >
        {config.label}
      </Text>
    </View>
  );
}

/**
 * A larger, more prominent variant for use in trip detail headers.
 */
export function CountdownBadgeLarge({
  days,
  status,
  currentDay,
  totalDays,
}: CountdownBadgeProps) {
  const config = getConfig(status, days, currentDay, totalDays);

  return (
    <View style={[styles.largeContainer, { backgroundColor: config.backgroundColor }]}>
      <Ionicons
        name={config.icon}
        size={20}
        color={config.color}
        style={styles.largeIcon}
      />
      <View>
        <Text style={[styles.largeValue, { color: config.color }]}>
          {config.primaryValue}
        </Text>
        {config.secondaryLabel ? (
          <Text style={[styles.largeLabel, { color: config.color }]}>
            {config.secondaryLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

interface BadgeConfig {
  label: string;
  primaryValue: string;
  secondaryLabel?: string;
  color: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function getConfig(
  status: TripStatus,
  days: number,
  currentDay?: number,
  totalDays?: number
): BadgeConfig {
  switch (status) {
    case 'upcoming': {
      const absDays = Math.abs(days);
      if (absDays === 0) {
        return {
          label: '¡Es hoy!',
          primaryValue: '¡Hoy!',
          secondaryLabel: 'Empieza tu viaje',
          color: Colors.success,
          backgroundColor: Colors.successMuted,
          icon: 'sparkles',
        };
      }
      if (absDays === 1) {
        return {
          label: '¡Mañana!',
          primaryValue: '1 día',
          secondaryLabel: 'para el viaje',
          color: Colors.primary,
          backgroundColor: Colors.primaryMuted,
          icon: 'alarm-outline',
        };
      }
      return {
        label: `Faltan ${absDays} días`,
        primaryValue: `${absDays} días`,
        secondaryLabel: 'para el viaje',
        color: Colors.tripUpcoming,
        backgroundColor: 'rgba(59, 130, 246, 0.10)',
        icon: 'hourglass-outline',
      };
    }

    case 'ongoing': {
      const dayLabel =
        currentDay && totalDays
          ? `Día ${currentDay} de ${totalDays}`
          : 'En curso';
      const remaining =
        totalDays && currentDay ? totalDays - currentDay : undefined;
      const secondaryLabel =
        remaining !== undefined && remaining > 0
          ? `Quedan ${remaining} día${remaining > 1 ? 's' : ''}`
          : remaining === 0
            ? 'Último día'
            : undefined;
      return {
        label: dayLabel,
        primaryValue: dayLabel,
        secondaryLabel,
        color: Colors.tripOngoing,
        backgroundColor: 'rgba(16, 185, 129, 0.10)',
        icon: 'navigate-outline',
      };
    }

    case 'past': {
      const absDays = Math.abs(days);
      const label =
        absDays === 0
          ? 'Terminó hoy'
          : absDays === 1
            ? 'Hace 1 día'
            : `Hace ${absDays} días`;
      return {
        label,
        primaryValue: 'Finalizado',
        secondaryLabel: label,
        color: Colors.tripPast,
        backgroundColor: 'rgba(156, 163, 175, 0.10)',
        icon: 'checkmark-circle-outline',
      };
    }

    default:
      return {
        label: '',
        primaryValue: '',
        color: Colors.textTertiary,
        backgroundColor: Colors.secondaryMuted,
        icon: 'help-circle-outline',
      };
  }
}

// ─── Size configs ─────────────────────────────────────────────────────

const SIZE_STYLES = {
  sm: {
    container: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    iconSize: 12,
    fontSize: FontSizes.xs,
  },
  md: {
    container: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs + 2,
    },
    iconSize: 14,
    fontSize: FontSizes.sm,
  },
  lg: {
    container: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
    },
    iconSize: 16,
    fontSize: FontSizes.md,
  },
} as const;

// ─── Styles ──────────────────────────────────────────────────────────

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
  text: {
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.2,
  },

  // ─── Large variant ────────────────────────────
  largeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    alignSelf: 'flex-start',
  },
  largeIcon: {
    marginRight: Spacing.md,
  },
  largeValue: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.base * 1.3,
  },
  largeLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    opacity: 0.8,
    marginTop: 1,
  },
});
