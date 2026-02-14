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
  Accommodation,
  AccommodationType,
  ACCOMMODATION_TYPES,
  ACCOMMODATION_ICONS,
  ACCOMMODATION_COLORS,
  getAccommodationNights,
} from '@/types/accommodation';
import { getTripById } from '@/services/storage';
import EmptyState from '@/components/ui/EmptyState';
import FAB from '@/components/ui/FAB';

// ─── Filter chip data ────────────────────────────────────────────────

interface FilterChip {
  key: AccommodationType | 'all';
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const ALL_FILTER_CHIPS: FilterChip[] = [
  { key: 'all', label: 'Todos' },
  { key: 'hotel', label: 'Hotel', icon: 'business', color: ACCOMMODATION_COLORS.hotel },
  { key: 'apartment', label: 'Apartamento', icon: 'home', color: ACCOMMODATION_COLORS.apartment },
  { key: 'hostel', label: 'Hostal', icon: 'bed', color: ACCOMMODATION_COLORS.hostel },
  { key: 'airbnb', label: 'Airbnb', icon: 'key', color: ACCOMMODATION_COLORS.airbnb },
  { key: 'camping', label: 'Camping', icon: 'bonfire', color: ACCOMMODATION_COLORS.camping },
  { key: 'rural_house', label: 'Casa rural', icon: 'leaf', color: ACCOMMODATION_COLORS.rural_house },
  { key: 'resort', label: 'Resort', icon: 'umbrella', color: ACCOMMODATION_COLORS.resort },
  { key: 'cruise', label: 'Crucero', icon: 'boat', color: ACCOMMODATION_COLORS.cruise },
  { key: 'campervan', label: 'Autocaravana', icon: 'car', color: ACCOMMODATION_COLORS.campervan },
  { key: 'friends_family', label: 'Amigos/Familia', icon: 'people', color: ACCOMMODATION_COLORS.friends_family },
  { key: 'other', label: 'Otro', icon: 'ellipsis-horizontal', color: ACCOMMODATION_COLORS.other },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDate(isoDateTime: string): string {
  try {
    const date = new Date(isoDateTime);
    const day = date.getDate();
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  } catch {
    return isoDateTime;
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

function getAccommodationStatus(
  accommodation: Accommodation
): 'past' | 'current' | 'future' {
  const now = new Date();
  const checkIn = new Date(accommodation.checkInDate);
  const checkOut = new Date(accommodation.checkOutDate);

  if (now > checkOut) return 'past';
  if (now >= checkIn && now <= checkOut) return 'current';
  return 'future';
}

// ─── Accommodation Card Component ────────────────────────────────────

interface AccommodationCardProps {
  accommodation: Accommodation;
  onPress: () => void;
}

function AccommodationCard({ accommodation, onPress }: AccommodationCardProps) {
  const typeIcon = ACCOMMODATION_ICONS[accommodation.type] as keyof typeof Ionicons.glyphMap;
  const typeColor = ACCOMMODATION_COLORS[accommodation.type];
  const typeLabel = accommodation.type === 'other' && accommodation.customType
    ? accommodation.customType
    : ACCOMMODATION_TYPES[accommodation.type];
  const nights = getAccommodationNights(accommodation);
  const status = getAccommodationStatus(accommodation);
  const isPast = status === 'past';
  const isCurrent = status === 'current';

  const checkInDate = formatDate(accommodation.checkInDate);
  const checkOutDate = formatDate(accommodation.checkOutDate);
  const checkInTime = formatTime(accommodation.checkInDate);
  const checkOutTime = formatTime(accommodation.checkOutDate);

  return (
    <TouchableOpacity
      style={[styles.accommodationCard, Shadows.card, isPast && styles.cardPast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left color accent */}
      <View style={[styles.cardAccent, { backgroundColor: typeColor }]} />

      <View style={styles.cardBody}>
        {/* Top row: type badge + status */}
        <View style={styles.cardTopRow}>
          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}14` }]}>
            <Ionicons name={typeIcon} size={13} color={typeColor} />
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>{typeLabel}</Text>
          </View>
          {isCurrent && (
            <View style={styles.currentBadge}>
              <View style={styles.currentDot} />
              <Text style={styles.currentText}>Ahora</Text>
            </View>
          )}
          {isPast && (
            <Text style={styles.pastLabel}>Finalizado</Text>
          )}
        </View>

        {/* Name */}
        <Text
          style={[styles.accommodationName, isPast && styles.accommodationNamePast]}
          numberOfLines={1}
        >
          {accommodation.name}
        </Text>

        {/* Address */}
        {accommodation.address ? (
          <View style={styles.addressRow}>
            <Ionicons
              name="location-outline"
              size={13}
              color={Colors.textTertiary}
              style={styles.addressIcon}
            />
            <Text style={styles.addressText} numberOfLines={1}>
              {accommodation.address}
            </Text>
          </View>
        ) : null}

        {/* Dates row */}
        <View style={styles.datesRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{checkInDate}</Text>
            {checkInTime ? <Text style={styles.dateTime}>{checkInTime}</Text> : null}
          </View>

          <View style={styles.datesConnector}>
            <View style={styles.datesLine} />
            <View style={styles.nightsBadge}>
              <Ionicons name="moon-outline" size={11} color={Colors.textSecondary} />
              <Text style={styles.nightsText}>
                {nights} noche{nights !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.datesLine} />
          </View>

          <View style={[styles.dateBlock, styles.dateBlockRight]}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.dateValue}>{checkOutDate}</Text>
            {checkOutTime ? <Text style={styles.dateTime}>{checkOutTime}</Text> : null}
          </View>
        </View>

        {/* Bottom row: confirmation code + price + attachments */}
        <View style={styles.cardBottomRow}>
          <View style={styles.cardBottomLeft}>
            {accommodation.confirmationCode ? (
              <View style={styles.confirmationBadge}>
                <Ionicons name="barcode-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.confirmationText}>
                  {accommodation.confirmationCode}
                </Text>
              </View>
            ) : null}

            {accommodation.phone ? (
              <View style={styles.contactIcon}>
                <Ionicons name="call-outline" size={12} color={Colors.textTertiary} />
              </View>
            ) : null}

            {accommodation.email ? (
              <View style={styles.contactIcon}>
                <Ionicons name="mail-outline" size={12} color={Colors.textTertiary} />
              </View>
            ) : null}
          </View>

          <View style={styles.cardBottomRight}>
            {(accommodation.attachments?.length ?? 0) > 0 && (
              <View style={styles.attachmentBadge}>
                <Ionicons name="attach" size={12} color={Colors.textTertiary} />
                <Text style={styles.attachmentCount}>
                  {accommodation.attachments!.length}
                </Text>
              </View>
            )}

            {accommodation.totalPrice !== undefined && accommodation.totalPrice > 0 && (
              <Text style={styles.priceText}>
                {accommodation.currency === 'EUR' ? '€' : accommodation.currency ?? '€'}
                {accommodation.totalPrice.toFixed(0)}
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

export default function AccommodationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AccommodationType | 'all'>('all');

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      const loaded = await getTripById(id);
      setTrip(loaded);
    } catch (error) {
      console.warn('[Accommodations] Error loading trip:', error);
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

  const handleAddAccommodation = useCallback(() => {
    // TODO: Navigate to add accommodation screen / show type selector
  }, []);

  const handleAccommodationPress = useCallback(
    (_accommodation: Accommodation) => {
      // TODO: Navigate to accommodation detail
    },
    []
  );

  // ─── Derived data ───────────────────────────────────────────────

  const allAccommodations = trip?.accommodations ?? [];
  const filteredAccommodations =
    activeFilter === 'all'
      ? allAccommodations
      : allAccommodations.filter((a) => a.type === activeFilter);

  // Sort chronologically by check-in date
  const sortedAccommodations = [...filteredAccommodations].sort(
    (a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
  );

  const isEmpty = allAccommodations.length === 0;
  const noResults = allAccommodations.length > 0 && filteredAccommodations.length === 0;

  // Counts by type
  const countsByType: Partial<Record<AccommodationType, number>> = {};
  allAccommodations.forEach((a) => {
    countsByType[a.type] = (countsByType[a.type] ?? 0) + 1;
  });

  // Available filter chips
  const availableFilters = ALL_FILTER_CHIPS.filter(
    (chip) => chip.key === 'all' || (countsByType[chip.key as AccommodationType] ?? 0) > 0
  );

  // Total nights
  const totalNights = allAccommodations.reduce(
    (sum, a) => sum + getAccommodationNights(a),
    0
  );

  // ─── Render ─────────────────────────────────────────────────────

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando alojamientos...</Text>
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
                  ? allAccommodations.length
                  : countsByType[chip.key as AccommodationType] ?? 0;

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
          icon="bed-outline"
          title="Sin alojamientos"
          description="Añade hoteles, apartamentos u otros alojamientos para tener toda la información de tu estancia."
          actionLabel="Añadir alojamiento"
          onAction={handleAddAccommodation}
        />
      ) : noResults ? (
        <EmptyState
          icon="filter-outline"
          title="Sin resultados"
          description={`No hay alojamientos de tipo "${
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
              {sortedAccommodations.length} alojamiento
              {sortedAccommodations.length !== 1 ? 's' : ''}
            </Text>
            {totalNights > 0 && (
              <View style={styles.nightsSummary}>
                <Ionicons
                  name="moon-outline"
                  size={13}
                  color={Colors.textTertiary}
                  style={styles.nightsSummaryIcon}
                />
                <Text style={styles.listSummaryText}>
                  {totalNights} noche{totalNights !== 1 ? 's' : ''} en total
                </Text>
              </View>
            )}
          </View>

          {sortedAccommodations.map((accommodation) => (
            <AccommodationCard
              key={accommodation.id}
              accommodation={accommodation}
              onPress={() => handleAccommodationPress(accommodation)}
            />
          ))}
        </ScrollView>
      )}

      {/* FAB */}
      <FAB
        icon="add"
        onPress={handleAddAccommodation}
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
  nightsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nightsSummaryIcon: {
    marginRight: Spacing.xs,
  },

  // ─── Accommodation card ─────────────────────────
  accommodationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  cardPast: {
    opacity: 0.6,
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
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    borderRadius: BorderRadius.full,
  },
  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: Spacing.xs,
  },
  currentText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
  },
  pastLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },

  // ─── Name + address ─────────────────────────────
  accommodationName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  accommodationNamePast: {
    color: Colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addressIcon: {
    marginRight: Spacing.xs,
  },
  addressText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },

  // ─── Dates row ──────────────────────────────────
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  dateBlock: {
    flex: 1,
  },
  dateBlockRight: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: Spacing['2xs'],
  },
  dateValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  dateTime: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  datesConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  datesLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  nightsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    marginHorizontal: Spacing.xs,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  nightsText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
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
  contactIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
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
