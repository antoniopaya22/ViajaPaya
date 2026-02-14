import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
} from '@/constants/theme';
import { Trip } from '@/types/trip';
import {
  Activity,
  ActivityType,
  ACTIVITY_TYPES,
  ACTIVITY_ICONS,
  ACTIVITY_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  getEstimatedDuration,
  formatDuration,
} from '@/types/activity';
import { getTripById } from '@/services/storage';
import EmptyState from '@/components/ui/EmptyState';
import FAB from '@/components/ui/FAB';

// ─── Filter chip data ────────────────────────────────────────────────

interface FilterChip {
  key: ActivityType | 'all';
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const ALL_FILTER_CHIPS: FilterChip[] = [
  { key: 'all', label: 'Todas' },
  { key: 'excursion', label: 'Excursión', icon: 'trail-sign', color: ACTIVITY_COLORS.excursion },
  { key: 'cultural_visit', label: 'Cultural', icon: 'library', color: ACTIVITY_COLORS.cultural_visit },
  { key: 'show', label: 'Espectáculo', icon: 'musical-notes', color: ACTIVITY_COLORS.show },
  { key: 'guided_tour', label: 'Tour', icon: 'flag', color: ACTIVITY_COLORS.guided_tour },
  { key: 'adventure', label: 'Aventura', icon: 'fitness', color: ACTIVITY_COLORS.adventure },
  { key: 'gastronomy', label: 'Gastronomía', icon: 'restaurant', color: ACTIVITY_COLORS.gastronomy },
  { key: 'nightlife', label: 'Noche', icon: 'moon', color: ACTIVITY_COLORS.nightlife },
  { key: 'wellness', label: 'Wellness', icon: 'heart', color: ACTIVITY_COLORS.wellness },
  { key: 'other', label: 'Otro', icon: 'ellipsis-horizontal', color: ACTIVITY_COLORS.other },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate + 'T00:00:00');
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

function formatDateFull(isoDate: string): string {
  try {
    const date = new Date(isoDate + 'T00:00:00');
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayName} ${day} ${month}`;
  } catch {
    return isoDate;
  }
}

function isActivityPast(activity: Activity): boolean {
  try {
    const actDate = new Date(activity.date + 'T23:59:59');
    return actDate < new Date();
  } catch {
    return false;
  }
}

function isActivityToday(activity: Activity): boolean {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  return activity.date === todayStr;
}

// ─── Activity Card Component ─────────────────────────────────────────

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
}

function ActivityCard({ activity, onPress }: ActivityCardProps) {
  const typeIcon = ACTIVITY_ICONS[activity.type] as keyof typeof Ionicons.glyphMap;
  const typeColor = ACTIVITY_COLORS[activity.type];
  const typeLabel = ACTIVITY_TYPES[activity.type];
  const isPast = isActivityPast(activity);
  const isToday = isActivityToday(activity);
  const isCompleted = activity.isCompleted;

  const duration = getEstimatedDuration(activity);
  const durationFormatted = duration ? formatDuration(duration) : null;

  const dateFormatted = formatDateFull(activity.date);

  const metaItems: string[] = [
    activity.provider,
    activity.location,
  ].filter(Boolean) as string[];

  return (
    <TouchableOpacity
      style={[
        styles.activityCard,
        Shadows.card,
        isPast && styles.cardPast,
        isCompleted && styles.cardCompleted,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left color accent */}
      <View style={[styles.cardAccent, { backgroundColor: typeColor }]} />

      <View style={styles.cardBody}>
        {/* Top row: type badge + date + today badge */}
        <View style={styles.cardTopRow}>
          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}14` }]}>
            <Ionicons name={typeIcon} size={13} color={typeColor} />
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>{typeLabel}</Text>
          </View>
          <View style={styles.cardTopRight}>
            {isToday && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>HOY</Text>
              </View>
            )}
            <Text style={styles.cardDate}>{dateFormatted}</Text>
          </View>
        </View>

        {/* Name row */}
        <View style={styles.nameRow}>
          {isCompleted && (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={Colors.success}
              style={styles.completedIcon}
            />
          )}
          <Text
            style={[
              styles.activityName,
              isPast && styles.activityNamePast,
              isCompleted && styles.activityNameCompleted,
            ]}
            numberOfLines={2}
          >
            {activity.name}
          </Text>
        </View>

        {/* Time + Duration row */}
        <View style={styles.timeRow}>
          {activity.startTime ? (
            <View style={styles.timeBadge}>
              <Ionicons
                name="time-outline"
                size={13}
                color={Colors.textSecondary}
                style={styles.timeIcon}
              />
              <Text style={styles.timeText}>
                {activity.startTime}
                {activity.endTime ? ` – ${activity.endTime}` : ''}
              </Text>
            </View>
          ) : (
            <View style={styles.timeBadge}>
              <Ionicons
                name="time-outline"
                size={13}
                color={Colors.textTertiary}
                style={styles.timeIcon}
              />
              <Text style={styles.timeTextUndefined}>Hora por definir</Text>
            </View>
          )}

          {durationFormatted && (
            <View style={styles.durationBadge}>
              <Ionicons
                name="hourglass-outline"
                size={11}
                color={Colors.textTertiary}
                style={styles.durationIcon}
              />
              <Text style={styles.durationText}>{durationFormatted}</Text>
            </View>
          )}
        </View>

        {/* Location + provider */}
        {metaItems.length > 0 && (
          <View style={styles.metaRow}>
            {activity.location ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={Colors.textTertiary}
                  style={styles.metaIcon}
                />
                <Text style={styles.metaText} numberOfLines={1}>
                  {activity.location}
                </Text>
              </View>
            ) : null}
            {activity.provider ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="storefront-outline"
                  size={12}
                  color={Colors.textTertiary}
                  style={styles.metaIcon}
                />
                <Text style={styles.metaText} numberOfLines={1}>
                  {activity.provider}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Meeting point */}
        {activity.meetingPoint ? (
          <View style={styles.meetingPointRow}>
            <Ionicons
              name="flag-outline"
              size={12}
              color={Colors.accent}
              style={styles.meetingPointIcon}
            />
            <Text style={styles.meetingPointText} numberOfLines={1}>
              Punto de encuentro: {activity.meetingPoint}
            </Text>
          </View>
        ) : null}

        {/* Bottom row: payment status + confirmation + price + attachments */}
        <View style={styles.cardBottomRow}>
          <View style={styles.cardBottomLeft}>
            {activity.paymentStatus ? (
              <View
                style={[
                  styles.paymentBadge,
                  {
                    backgroundColor: `${PAYMENT_STATUS_COLORS[activity.paymentStatus]}18`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.paymentDot,
                    { backgroundColor: PAYMENT_STATUS_COLORS[activity.paymentStatus] },
                  ]}
                />
                <Text
                  style={[
                    styles.paymentText,
                    { color: PAYMENT_STATUS_COLORS[activity.paymentStatus] },
                  ]}
                >
                  {PAYMENT_STATUS_LABELS[activity.paymentStatus]}
                </Text>
              </View>
            ) : null}

            {activity.confirmationCode ? (
              <View style={styles.confirmationBadge}>
                <Ionicons name="barcode-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.confirmationText}>{activity.confirmationCode}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.cardBottomRight}>
            {(activity.attachments?.length ?? 0) > 0 && (
              <View style={styles.attachmentBadge}>
                <Ionicons name="attach" size={12} color={Colors.textTertiary} />
                <Text style={styles.attachmentCount}>{activity.attachments!.length}</Text>
              </View>
            )}

            {activity.price !== undefined && activity.price > 0 && (
              <Text style={styles.priceText}>
                {activity.currency === 'EUR' ? '€' : activity.currency ?? '€'}
                {activity.price.toFixed(0)}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Chevron */}
      <View style={styles.cardChevronContainer}>
        <Ionicons
          name="chevron-forward"
          size={Layout.iconSizeMedium}
          color={Colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function ActivitiesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ActivityType | 'all'>('all');

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      const loaded = await getTripById(id);
      setTrip(loaded);
    } catch (error) {
      console.warn('[Activities] Error loading trip:', error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadTrip();
    }, [loadTrip])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrip();
    setRefreshing(false);
  }, [loadTrip]);

  const handleAddActivity = useCallback(() => {
    // TODO: Navigate to add activity screen / show type selector
  }, []);

  const handleActivityPress = useCallback(
    (_activity: Activity) => {
      // TODO: Navigate to activity detail
    },
    []
  );

  // ─── Derived data ───────────────────────────────────────────────

  const allActivities = trip?.activities ?? [];
  const filteredActivities =
    activeFilter === 'all'
      ? allActivities
      : allActivities.filter((a) => a.type === activeFilter);

  // Sort chronologically by date then time
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    const timeA = a.startTime || '99:99';
    const timeB = b.startTime || '99:99';
    return timeA.localeCompare(timeB);
  });

  const isEmpty = allActivities.length === 0;
  const noResults = allActivities.length > 0 && filteredActivities.length === 0;

  // Counts by type
  const countsByType: Partial<Record<ActivityType, number>> = {};
  allActivities.forEach((a) => {
    countsByType[a.type] = (countsByType[a.type] ?? 0) + 1;
  });

  // Available filter chips
  const availableFilters = ALL_FILTER_CHIPS.filter(
    (chip) => chip.key === 'all' || (countsByType[chip.key as ActivityType] ?? 0) > 0
  );

  // Stats
  const completedCount = allActivities.filter((a) => a.isCompleted).length;
  const pendingCount = allActivities.length - completedCount;

  // ─── Render ─────────────────────────────────────────────────────

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando actividades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Filter bar */}
      {!isEmpty && (
        <View style={styles.filterBarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBarContent}
          >
            {availableFilters.map((chip) => {
              const isActive = activeFilter === chip.key;
              const count =
                chip.key === 'all'
                  ? allActivities.length
                  : countsByType[chip.key as ActivityType] ?? 0;

              return (
                <TouchableOpacity
                  key={chip.key}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(chip.key)}
                  activeOpacity={0.7}
                >
                  {chip.icon && (
                    <Ionicons
                      name={chip.icon}
                      size={14}
                      color={isActive ? Colors.primary : Colors.textSecondary}
                      style={styles.filterChipIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {chip.label}
                  </Text>
                  <View
                    style={[
                      styles.filterCountBadge,
                      isActive && styles.filterCountBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterCountText,
                        isActive && styles.filterCountTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {isEmpty ? (
        <EmptyState
          icon="ticket-outline"
          title="Sin actividades"
          description="Añade visitas, excursiones, tours y otros planes para organizar tu itinerario."
          actionLabel="Añadir actividad"
          onAction={handleAddActivity}
        />
      ) : noResults ? (
        <EmptyState
          icon="filter-outline"
          title="Sin resultados"
          description={`No hay actividades de tipo "${
            ALL_FILTER_CHIPS.find((c) => c.key === activeFilter)?.label ?? activeFilter
          }".`}
          compact
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing['3xl'] },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          {/* Summary bar */}
          <View style={styles.listSummary}>
            <Text style={styles.listSummaryText}>
              {sortedActivities.length} actividad
              {sortedActivities.length !== 1 ? 'es' : ''}
            </Text>
            <View style={styles.summaryStats}>
              {completedCount > 0 && (
                <View style={styles.summaryStatItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={13}
                    color={Colors.success}
                    style={styles.summaryStatIcon}
                  />
                  <Text style={[styles.listSummaryText, { color: Colors.success }]}>
                    {completedCount} completada{completedCount !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {pendingCount > 0 && completedCount > 0 && (
                <View style={styles.summaryDot} />
              )}
              {pendingCount > 0 && (
                <View style={styles.summaryStatItem}>
                  <Text style={styles.listSummaryText}>
                    {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {sortedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onPress={() => handleActivityPress(activity)}
            />
          ))}
        </ScrollView>
      )}

      {/* FAB */}
      <FAB
        icon="add"
        onPress={handleAddActivity}
        style={{
          bottom: insets.bottom + Spacing.base,
        }}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },

  // ─── Filter bar ─────────────────────────────────
  filterBarContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  filterBarContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primaryLight,
  },
  filterChipIcon: {
    marginRight: Spacing.xs,
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  filterCountBadge: {
    marginLeft: Spacing.xs,
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  filterCountBadgeActive: {
    backgroundColor: Colors.primaryMutedStrong,
  },
  filterCountText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textTertiary,
  },
  filterCountTextActive: {
    color: Colors.primary,
  },

  // ─── List ───────────────────────────────────────
  listContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
  },
  listSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  listSummaryText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStatIcon: {
    marginRight: Spacing.xs,
  },
  summaryDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textTertiary,
    marginHorizontal: Spacing.sm,
  },

  // ─── Activity card ──────────────────────────────
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  cardPast: {
    opacity: 0.6,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: Spacing.md,
  },
  cardChevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: Spacing.md,
    paddingLeft: Spacing.xs,
  },

  // ─── Card top row ───────────────────────────────
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  typeBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  todayBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    borderRadius: BorderRadius.xs,
  },
  todayBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.tripOngoing,
    letterSpacing: 0.5,
  },
  cardDate: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },

  // ─── Name ───────────────────────────────────────
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  completedIcon: {
    marginRight: Spacing.xs,
    marginTop: 1,
  },
  activityName: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    lineHeight: FontSizes.lg * 1.3,
  },
  activityNamePast: {
    color: Colors.textSecondary,
  },
  activityNameCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },

  // ─── Time row ───────────────────────────────────
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: Spacing.xs,
  },
  timeText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  timeTextUndefined: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
  },
  durationIcon: {
    marginRight: Spacing.xs,
  },
  durationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },

  // ─── Meta row ───────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  metaIcon: {
    marginRight: Spacing.xs,
  },
  metaText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },

  // ─── Meeting point ──────────────────────────────
  meetingPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentMuted,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  meetingPointIcon: {
    marginRight: Spacing.xs,
  },
  meetingPointText: {
    flex: 1,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.accent,
  },

  // ─── Card bottom row ────────────────────────────
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  paymentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  paymentText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  confirmationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  confirmationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  cardBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  attachmentCount: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },
  priceText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
});
