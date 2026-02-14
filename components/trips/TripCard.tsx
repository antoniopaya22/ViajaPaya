import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
} from '@/constants/theme';
import {
  Trip,
  TripStatus,
  getTripStatus,
  getTripDurationDays,
  getDaysUntilTrip,
  getCurrentDayOfTrip,
} from '@/types/trip';
import StatusBadge from '@/components/ui/StatusBadge';
import CountdownBadge from '@/components/ui/CountdownBadge';

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;
  variant?: 'default' | 'featured';
}

export default function TripCard({
  trip,
  onPress,
  variant = 'default',
}: TripCardProps) {
  const status = getTripStatus(trip);
  const durationDays = getTripDurationDays(trip);
  const daysUntil = getDaysUntilTrip(trip);
  const currentDay = status === 'ongoing' ? getCurrentDayOfTrip(trip) : undefined;

  const transportCount = trip.transports?.length ?? 0;
  const accommodationCount = trip.accommodations?.length ?? 0;
  const activityCount = trip.activities?.length ?? 0;

  const startFormatted = formatDateShort(trip.startDate);
  const endFormatted = formatDateShort(trip.endDate);

  const isFeatured = variant === 'featured' || status === 'ongoing';

  if (isFeatured) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.featuredContainer, Shadows.lg]}
      >
        {trip.coverImage ? (
          <ImageBackground
            source={{ uri: trip.coverImage }}
            style={styles.featuredImageBg}
            imageStyle={styles.featuredImageStyle}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.75)']}
              locations={[0, 0.5, 1]}
              style={styles.featuredGradient}
            >
              {renderFeaturedContent(
                trip,
                status,
                durationDays,
                daysUntil,
                currentDay,
                startFormatted,
                endFormatted,
                transportCount,
                accommodationCount,
                activityCount
              )}
            </LinearGradient>
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark, Colors.secondary]}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredGradientBg}
          >
            {/* Decorative circles */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />

            {renderFeaturedContent(
              trip,
              status,
              durationDays,
              daysUntil,
              currentDay,
              startFormatted,
              endFormatted,
              transportCount,
              accommodationCount,
              activityCount
            )}
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  }

  // ─── Default card ────────────────────────────────────────────────
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, Shadows.card]}
    >
      {/* Left accent strip */}
      <View style={[styles.accentStrip, { backgroundColor: getStatusColor(status) }]} />

      <View style={styles.body}>
        {/* Top row: status + countdown */}
        <View style={styles.topRow}>
          <StatusBadge status={status} size="sm" />
          {status === 'upcoming' && daysUntil > 0 && (
            <CountdownBadge
              days={daysUntil}
              status={status}
              size="sm"
            />
          )}
        </View>

        {/* Middle: name + destination */}
        <Text style={styles.tripName} numberOfLines={1}>
          {trip.name}
        </Text>

        <View style={styles.destinationRow}>
          <Ionicons
            name="location"
            size={14}
            color={Colors.primary}
            style={styles.destinationIcon}
          />
          <Text style={styles.destination} numberOfLines={1}>
            {trip.destination}
          </Text>
        </View>

        {/* Bottom row: dates + stats */}
        <View style={styles.bottomRow}>
          <View style={styles.dateChip}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={Colors.textSecondary}
              style={styles.dateIcon}
            />
            <Text style={styles.dateText}>
              {startFormatted} — {endFormatted}
            </Text>
            <View style={styles.daysBadge}>
              <Text style={styles.daysText}>{durationDays}d</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {transportCount > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="airplane" size={12} color={Colors.categoryTransport} />
                <Text style={styles.statText}>{transportCount}</Text>
              </View>
            )}
            {accommodationCount > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="bed" size={12} color={Colors.categoryAccommodation} />
                <Text style={styles.statText}>{accommodationCount}</Text>
              </View>
            )}
            {activityCount > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="ticket" size={12} color={Colors.categoryActivity} />
                <Text style={styles.statText}>{activityCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Right side thumbnail or chevron */}
      <View style={styles.rightSection}>
        {trip.coverImage ? (
          <ImageBackground
            source={{ uri: trip.coverImage }}
            style={styles.thumbnail}
            imageStyle={styles.thumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons
              name="airplane"
              size={22}
              color={Colors.primaryLight}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Featured card inner content ─────────────────────────────────────

function renderFeaturedContent(
  trip: Trip,
  status: TripStatus,
  durationDays: number,
  daysUntil: number,
  currentDay: number | undefined,
  startFormatted: string,
  endFormatted: string,
  transportCount: number,
  accommodationCount: number,
  activityCount: number
) {
  return (
    <View style={styles.featuredContent}>
      {/* Top section: badges */}
      <View style={styles.featuredTopRow}>
        <StatusBadge status={status} size="md" />
        <CountdownBadge
          days={daysUntil}
          status={status}
          currentDay={currentDay}
          totalDays={durationDays}
          size="md"
        />
      </View>

      {/* Bottom section: trip info */}
      <View style={styles.featuredBottomSection}>
        <Text style={styles.featuredName} numberOfLines={2}>
          {trip.name}
        </Text>

        <View style={styles.featuredDestinationRow}>
          <Ionicons
            name="location"
            size={16}
            color={Colors.primaryLight}
            style={styles.destinationIcon}
          />
          <Text style={styles.featuredDestination} numberOfLines={1}>
            {trip.destination}
          </Text>
        </View>

        <View style={styles.featuredMetaRow}>
          {/* Dates */}
          <View style={styles.featuredDateChip}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color="rgba(255,255,255,0.7)"
              style={styles.dateIcon}
            />
            <Text style={styles.featuredDateText}>
              {startFormatted} — {endFormatted}
            </Text>
            <View style={styles.featuredDaysBadge}>
              <Text style={styles.featuredDaysText}>{durationDays}d</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.featuredStatsRow}>
            {transportCount > 0 && (
              <View style={styles.featuredStatItem}>
                <Ionicons name="airplane" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featuredStatText}>{transportCount}</Text>
              </View>
            )}
            {accommodationCount > 0 && (
              <View style={styles.featuredStatItem}>
                <Ionicons name="bed" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featuredStatText}>{accommodationCount}</Text>
              </View>
            )}
            {activityCount > 0 && (
              <View style={styles.featuredStatItem}>
                <Ionicons name="ticket" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.featuredStatText}>{activityCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getStatusColor(status: TripStatus): string {
  switch (status) {
    case 'upcoming':
      return Colors.tripUpcoming;
    case 'ongoing':
      return Colors.tripOngoing;
    case 'past':
      return Colors.tripPast;
    default:
      return Colors.border;
  }
}

function formatDateShort(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const day = date.getDate();
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  } catch {
    return isoDate;
  }
}

// ─── Styles ──────────────────────────────────────────────────────────

const FEATURED_HEIGHT = 220;
const THUMBNAIL_SIZE = 72;

const styles = StyleSheet.create({
  // ─── Default card ──────────────────────────────
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  accentStrip: {
    width: 4,
  },
  body: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  tripName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  destinationIcon: {
    marginRight: Spacing.xs,
  },
  destination: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  daysBadge: {
    marginLeft: Spacing.xs,
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.xs + 1,
    paddingVertical: 1,
  },
  daysText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },

  // ─── Right section ─────────────────────────────
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  thumbnailImage: {
    borderRadius: BorderRadius.md,
  },
  thumbnailPlaceholder: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Featured card ─────────────────────────────
  featuredContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    height: FEATURED_HEIGHT,
  },
  featuredImageBg: {
    width: '100%',
    height: '100%',
  },
  featuredImageStyle: {
    borderRadius: BorderRadius.xl,
  },
  featuredGradient: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  featuredGradientBg: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredBottomSection: {},
  featuredName: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuredDestinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featuredDestination: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredDateChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredDateText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: 'rgba(255,255,255,0.7)',
  },
  featuredDaysBadge: {
    marginLeft: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.xs + 1,
    paddingVertical: 1,
  },
  featuredDaysText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textInverse,
  },
  featuredStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featuredStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  featuredStatText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: 'rgba(255,255,255,0.85)',
  },

  // ─── Decorative elements ───────────────────────
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 60,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
