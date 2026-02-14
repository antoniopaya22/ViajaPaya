import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
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
import {
  Trip,
  getTripStatus,
  getTripDurationDays,
  getCurrentDayOfTrip,
} from '@/types/trip';
import { TRANSPORT_ICONS, TRANSPORT_COLORS, TRANSPORT_TYPES, Transport } from '@/types/transport';
import { ACCOMMODATION_ICONS, ACCOMMODATION_COLORS, ACCOMMODATION_TYPES, Accommodation } from '@/types/accommodation';
import { ACTIVITY_ICONS, ACTIVITY_COLORS, ACTIVITY_TYPES, Activity } from '@/types/activity';
import { getTripById } from '@/services/storage';
import EmptyState from '@/components/ui/EmptyState';

// ─── Types ───────────────────────────────────────────────────────────

type TimelineEventType = 'transport' | 'accommodation_checkin' | 'accommodation_checkout' | 'activity';

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  subtitle: string;
  time: string; // HH:mm or empty
  sortKey: number; // timestamp for sorting
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isPast: boolean;
  rawData: Transport | Accommodation | Activity;
}

interface TimelineDay {
  date: string; // YYYY-MM-DD
  dateFormatted: string;
  dayLabel: string;
  isToday: boolean;
  isPast: boolean;
  data: TimelineEvent[];
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDateHeader(isoDate: string): string {
  try {
    const date = new Date(isoDate + 'T00:00:00');
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayName}, ${day} de ${month}`;
  } catch {
    return isoDate;
  }
}

function formatTime(isoDateTime: string): string {
  try {
    const date = new Date(isoDateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (hours === '00' && minutes === '00') return '';
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

function getDateOnly(isoDateTime: string): string {
  try {
    if (isoDateTime.length === 10) return isoDateTime; // Already YYYY-MM-DD
    const date = new Date(isoDateTime);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch {
    return isoDateTime.substring(0, 10);
  }
}

function isDatePast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + 'T00:00:00');
  return date < today;
}

function isDateToday(dateStr: string): boolean {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  return dateStr === todayStr;
}

function buildTimeline(trip: Trip): TimelineDay[] {
  const events: Map<string, TimelineEvent[]> = new Map();

  const addEvent = (dateKey: string, event: TimelineEvent) => {
    if (!events.has(dateKey)) {
      events.set(dateKey, []);
    }
    events.get(dateKey)!.push(event);
  };

  // ─── Transports ─────────────────────────────
  (trip.transports ?? []).forEach((t) => {
    const dateKey = getDateOnly(t.departureDate);
    const time = formatTime(t.departureDate);
    addEvent(dateKey, {
      id: `transport_${t.id}`,
      type: 'transport',
      title: `${t.origin} → ${t.destination}`,
      subtitle: [TRANSPORT_TYPES[t.type], t.company, t.serviceNumber].filter(Boolean).join(' · '),
      time,
      sortKey: new Date(t.departureDate).getTime(),
      icon: TRANSPORT_ICONS[t.type] as keyof typeof Ionicons.glyphMap,
      color: TRANSPORT_COLORS[t.type],
      isPast: isDatePast(dateKey),
      rawData: t,
    });
  });

  // ─── Accommodations (check-in and check-out) ─
  (trip.accommodations ?? []).forEach((a) => {
    const checkinDate = getDateOnly(a.checkInDate);
    const checkoutDate = getDateOnly(a.checkOutDate);
    const checkinTime = formatTime(a.checkInDate);
    const checkoutTime = formatTime(a.checkOutDate);

    addEvent(checkinDate, {
      id: `acc_in_${a.id}`,
      type: 'accommodation_checkin',
      title: `Check-in: ${a.name}`,
      subtitle: [ACCOMMODATION_TYPES[a.type], a.address].filter(Boolean).join(' · '),
      time: checkinTime,
      sortKey: new Date(a.checkInDate).getTime(),
      icon: 'log-in-outline',
      color: ACCOMMODATION_COLORS[a.type],
      isPast: isDatePast(checkinDate),
      rawData: a,
    });

    addEvent(checkoutDate, {
      id: `acc_out_${a.id}`,
      type: 'accommodation_checkout',
      title: `Check-out: ${a.name}`,
      subtitle: ACCOMMODATION_TYPES[a.type],
      time: checkoutTime,
      sortKey: new Date(a.checkOutDate).getTime(),
      icon: 'log-out-outline',
      color: ACCOMMODATION_COLORS[a.type],
      isPast: isDatePast(checkoutDate),
      rawData: a,
    });
  });

  // ─── Activities ─────────────────────────────
  (trip.activities ?? []).forEach((a) => {
    const dateKey = a.date; // Already YYYY-MM-DD
    const time = a.startTime || '';
    const sortTime = a.startTime
      ? new Date(`${a.date}T${a.startTime}:00`).getTime()
      : new Date(`${a.date}T23:59:00`).getTime(); // No time → end of day

    addEvent(dateKey, {
      id: `act_${a.id}`,
      type: 'activity',
      title: a.name,
      subtitle: [ACTIVITY_TYPES[a.type], a.location].filter(Boolean).join(' · '),
      time,
      sortKey: sortTime,
      icon: ACTIVITY_ICONS[a.type] as keyof typeof Ionicons.glyphMap,
      color: ACTIVITY_COLORS[a.type],
      isPast: isDatePast(dateKey),
      rawData: a,
    });
  });

  // ─── Build all days in the trip range ───────
  const days: TimelineDay[] = [];
  const startDate = new Date(trip.startDate + 'T00:00:00');
  const endDate = new Date(trip.endDate + 'T00:00:00');
  const totalDays = getTripDurationDays(trip);

  for (let i = 0; i < totalDays; i++) {
    const current = new Date(startDate);
    current.setDate(current.getDate() + i);
    const y = current.getFullYear();
    const m = (current.getMonth() + 1).toString().padStart(2, '0');
    const d = current.getDate().toString().padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    const dayEvents = events.get(dateKey) ?? [];
    // Sort events by time
    dayEvents.sort((a, b) => a.sortKey - b.sortKey);

    days.push({
      date: dateKey,
      dateFormatted: formatDateHeader(dateKey),
      dayLabel: `Día ${i + 1}`,
      isToday: isDateToday(dateKey),
      isPast: isDatePast(dateKey),
      data: dayEvents.length > 0 ? dayEvents : [createEmptyPlaceholder(dateKey)],
    });
  }

  // Also include events outside trip range (if any)
  events.forEach((evts, dateKey) => {
    if (!days.find((d) => d.date === dateKey)) {
      evts.sort((a, b) => a.sortKey - b.sortKey);
      days.push({
        date: dateKey,
        dateFormatted: formatDateHeader(dateKey),
        dayLabel: 'Fuera del viaje',
        isToday: isDateToday(dateKey),
        isPast: isDatePast(dateKey),
        data: evts,
      });
    }
  });

  // Sort days chronologically
  days.sort((a, b) => a.date.localeCompare(b.date));

  return days;
}

function createEmptyPlaceholder(dateKey: string): TimelineEvent {
  return {
    id: `empty_${dateKey}`,
    type: 'activity',
    title: '',
    subtitle: '',
    time: '',
    sortKey: 0,
    icon: 'add-circle-outline',
    color: Colors.textTertiary,
    isPast: isDatePast(dateKey),
    rawData: {} as Activity,
  };
}

// ─── Component ───────────────────────────────────────────────────────

export default function TimelineScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      const loaded = await getTripById(id);
      setTrip(loaded);
    } catch (error) {
      console.warn('[Timeline] Error loading trip:', error);
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

  const handleEventPress = useCallback(
    (event: TimelineEvent) => {
      // TODO: Navigate to event detail
    },
    [id, router]
  );

  const handleAddEvent = useCallback(
    (_dateKey: string) => {
      // TODO: Show add event bottom sheet for this date
    },
    [id]
  );

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando timeline...</Text>
      </View>
    );
  }

  // ─── Build timeline data ────────────────────────────────────────

  const totalEvents =
    (trip.transports?.length ?? 0) +
    (trip.accommodations?.length ?? 0) +
    (trip.activities?.length ?? 0);

  const timelineDays = buildTimeline(trip);

  // Find today index for initial scroll
  const todayIndex = timelineDays.findIndex((d) => d.isToday);

  if (totalEvents === 0 && timelineDays.length === 0) {
    return (
      <EmptyState
        icon="time-outline"
        title="Timeline vacío"
        description="Añade transportes, alojamientos o actividades para ver tu itinerario día a día."
        actionLabel="Ir al resumen"
        onAction={() => router.replace(`/trip/${id}` as any)}
      />
    );
  }

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <View style={styles.screen}>
      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.summaryText}>
            {timelineDays.length} día{timelineDays.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.summaryDot} />
        <View style={styles.summaryItem}>
          <Ionicons name="layers-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.summaryText}>
            {totalEvents} evento{totalEvents !== 1 ? 's' : ''}
          </Text>
        </View>
        {todayIndex >= 0 && (
          <>
            <View style={styles.summaryDot} />
            <View style={[styles.summaryItem, styles.todayIndicator]}>
              <Ionicons name="navigate" size={12} color={Colors.tripOngoing} />
              <Text style={[styles.summaryText, { color: Colors.tripOngoing, fontWeight: FontWeights.semibold }]}>
                Hoy
              </Text>
            </View>
          </>
        )}
      </View>

      <SectionList
        sections={timelineDays}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
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
        renderSectionHeader={({ section }) => {
          const day = section as unknown as TimelineDay;
          return (
            <View style={[styles.dayHeader, day.isToday && styles.dayHeaderToday]}>
              <View style={styles.dayHeaderLeft}>
                <View
                  style={[
                    styles.dayBadge,
                    day.isToday && styles.dayBadgeToday,
                    day.isPast && !day.isToday && styles.dayBadgePast,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayBadgeText,
                      day.isToday && styles.dayBadgeTextToday,
                      day.isPast && !day.isToday && styles.dayBadgeTextPast,
                    ]}
                  >
                    {day.dayLabel}
                  </Text>
                </View>
                {day.isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>HOY</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.dayDateText,
                  day.isPast && !day.isToday && styles.dayDateTextPast,
                ]}
              >
                {day.dateFormatted}
              </Text>
            </View>
          );
        }}
        renderItem={({ item, section }) => {
          const day = section as unknown as TimelineDay;

          // Empty day placeholder
          if (item.title === '' && item.id.startsWith('empty_')) {
            return (
              <View style={styles.emptyDayCard}>
                <Ionicons
                  name="sunny-outline"
                  size={20}
                  color={Colors.textTertiary}
                  style={styles.emptyDayIcon}
                />
                <Text style={styles.emptyDayText}>
                  Día libre — sin eventos planificados
                </Text>
                <TouchableOpacity
                  style={styles.emptyDayAddButton}
                  onPress={() => handleAddEvent(day.date)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color={Colors.primary} />
                  <Text style={styles.emptyDayAddText}>Añadir</Text>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              style={[
                styles.eventCard,
                Shadows.sm,
                item.isPast && styles.eventCardPast,
              ]}
              onPress={() => handleEventPress(item)}
              activeOpacity={0.7}
            >
              {/* Timeline connector */}
              <View style={styles.timelineConnector}>
                <View style={styles.timelineLine} />
                <View style={[styles.timelineDot, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={12} color={Colors.textInverse} />
                </View>
                <View style={styles.timelineLine} />
              </View>

              {/* Event content */}
              <View style={styles.eventContent}>
                {/* Time badge */}
                {item.time ? (
                  <View style={styles.timeBadge}>
                    <Ionicons
                      name="time-outline"
                      size={11}
                      color={Colors.textSecondary}
                      style={styles.timeIcon}
                    />
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                ) : (
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeTextUndefined}>Hora por definir</Text>
                  </View>
                )}

                {/* Title */}
                <Text
                  style={[
                    styles.eventTitle,
                    item.isPast && styles.eventTitlePast,
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                {/* Subtitle */}
                {item.subtitle ? (
                  <Text style={styles.eventSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                ) : null}

                {/* Type indicator */}
                <View style={styles.eventTypeRow}>
                  <View
                    style={[
                      styles.eventTypeBadge,
                      { backgroundColor: `${item.color}14` },
                    ]}
                  >
                    <Ionicons name={item.icon} size={11} color={item.color} />
                    <Text style={[styles.eventTypeText, { color: item.color }]}>
                      {getEventTypeLabel(item.type)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Chevron */}
              <Ionicons
                name="chevron-forward"
                size={Layout.iconSizeMedium}
                color={Colors.textTertiary}
                style={styles.eventChevron}
              />
            </TouchableOpacity>
          );
        }}
        renderSectionFooter={({ section }) => {
          const day = section as unknown as TimelineDay;
          const hasRealEvents = day.data.some(
            (e) => !(e.title === '' && e.id.startsWith('empty_'))
          );
          if (!hasRealEvents) return null;
          return (
            <TouchableOpacity
              style={styles.addEventRow}
              onPress={() => handleAddEvent(day.date)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle-outline"
                size={16}
                color={Colors.primary}
                style={styles.addEventIcon}
              />
              <Text style={styles.addEventText}>Añadir evento</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ─── Helper ──────────────────────────────────────────────────────────

function getEventTypeLabel(type: TimelineEventType): string {
  switch (type) {
    case 'transport':
      return 'Transporte';
    case 'accommodation_checkin':
      return 'Check-in';
    case 'accommodation_checkout':
      return 'Check-out';
    case 'activity':
      return 'Actividad';
    default:
      return '';
  }
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

  // ─── Summary bar ────────────────────────────────
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textTertiary,
    marginHorizontal: Spacing.sm,
  },
  summaryText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  todayIndicator: {
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
    borderRadius: BorderRadius.full,
  },

  // ─── List content ───────────────────────────────
  listContent: {
    paddingTop: Spacing.sm,
  },

  // ─── Day header ─────────────────────────────────
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  dayHeaderToday: {
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dayBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    borderRadius: BorderRadius.xs,
  },
  dayBadgeToday: {
    backgroundColor: Colors.tripOngoing,
  },
  dayBadgePast: {
    backgroundColor: Colors.secondaryMuted,
  },
  dayBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  dayBadgeTextToday: {
    color: Colors.textInverse,
  },
  dayBadgeTextPast: {
    color: Colors.textTertiary,
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
  dayDateText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  dayDateTextPast: {
    color: Colors.textTertiary,
  },

  // ─── Empty day ──────────────────────────────────
  emptyDayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  emptyDayIcon: {
    marginRight: Spacing.sm,
  },
  emptyDayText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  emptyDayAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryMuted,
    gap: Spacing.xs,
  },
  emptyDayAddText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },

  // ─── Event card ─────────────────────────────────
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.screenPaddingHorizontal,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  eventCardPast: {
    opacity: 0.6,
  },

  // ─── Timeline connector ─────────────────────────
  timelineConnector: {
    width: 28,
    alignItems: 'center',
    marginRight: Spacing.md,
    alignSelf: 'stretch',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.borderLight,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },

  // ─── Event content ──────────────────────────────
  eventContent: {
    flex: 1,
    justifyContent: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  timeIcon: {
    marginRight: 3,
  },
  timeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  timeTextUndefined: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  eventTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  eventTitlePast: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  eventSubtitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  eventTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  eventTypeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  eventChevron: {
    marginLeft: Spacing.sm,
  },

  // ─── Add event row ──────────────────────────────
  addEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginHorizontal: Layout.screenPaddingHorizontal,
    marginBottom: Spacing.base,
  },
  addEventIcon: {
    marginRight: Spacing.xs,
  },
  addEventText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
});
