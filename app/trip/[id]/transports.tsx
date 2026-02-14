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
import {
  Trip,
} from '@/types/trip';
import {
  Transport,
  TransportType,
  TRANSPORT_TYPES,
  TRANSPORT_ICONS,
  TRANSPORT_COLORS,
} from '@/types/transport';
import { getTripById } from '@/services/storage';
import EmptyState from '@/components/ui/EmptyState';
import FAB from '@/components/ui/FAB';

// ─── Filter chip data ────────────────────────────────────────────────

interface FilterChip {
  key: TransportType | 'all';
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const FILTER_CHIPS: FilterChip[] = [
  { key: 'all', label: 'Todos' },
  { key: 'flight', label: 'Vuelos', icon: 'airplane', color: TRANSPORT_COLORS.flight },
  { key: 'train', label: 'Trenes', icon: 'train', color: TRANSPORT_COLORS.train },
  { key: 'bus', label: 'Buses', icon: 'bus', color: TRANSPORT_COLORS.bus },
  { key: 'ferry', label: 'Ferries', icon: 'boat', color: TRANSPORT_COLORS.ferry },
  { key: 'car_rental', label: 'Coches', icon: 'car', color: TRANSPORT_COLORS.car_rental },
  { key: 'transfer', label: 'Traslados', icon: 'car-sport', color: TRANSPORT_COLORS.transfer },
  { key: 'other', label: 'Otros', icon: 'swap-horizontal', color: TRANSPORT_COLORS.other },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDateTime(isoDateTime: string): string {
  try {
    const date = new Date(isoDateTime);
    const day = date.getDate();
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const hasTime = !(hours === '00' && minutes === '00');
    return hasTime ? `${day} ${month} · ${hours}:${minutes}` : `${day} ${month}`;
  } catch {
    return isoDateTime;
  }
}

function formatTimeOnly(isoDateTime: string): string {
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

function isTransportPast(transport: Transport): boolean {
  try {
    const depDate = new Date(transport.departureDate);
    return depDate < new Date();
  } catch {
    return false;
  }
}

// ─── Transport Card Component ────────────────────────────────────────

interface TransportCardProps {
  transport: Transport;
  onPress: () => void;
}

function TransportCard({ transport, onPress }: TransportCardProps) {
  const typeIcon = TRANSPORT_ICONS[transport.type] as keyof typeof Ionicons.glyphMap;
  const typeColor = TRANSPORT_COLORS[transport.type];
  const typeLabel = TRANSPORT_TYPES[transport.type];
  const isPast = isTransportPast(transport);

  const departureTime = formatTimeOnly(transport.departureDate);
  const arrivalTime = transport.arrivalDate ? formatTimeOnly(transport.arrivalDate) : '';
  const dateFormatted = formatDateTime(transport.departureDate);

  const infoChips: string[] = [
    transport.company,
    transport.serviceNumber,
    transport.travelClass,
  ].filter(Boolean) as string[];

  return (
    <TouchableOpacity
      style={[styles.transportCard, Shadows.card, isPast && styles.transportCardPast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left color accent */}
      <View style={[styles.cardAccent, { backgroundColor: typeColor }]} />

      <View style={styles.cardBody}>
        {/* Top row: type badge + date */}
        <View style={styles.cardTopRow}>
          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}14` }]}>
            <Ionicons name={typeIcon} size={13} color={typeColor} />
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>{typeLabel}</Text>
          </View>
          <Text style={styles.cardDate}>{dateFormatted}</Text>
        </View>

        {/* Route: Origin → Destination */}
        <View style={styles.routeRow}>
          <View style={styles.routeEndpoint}>
            <View style={[styles.routeDot, { backgroundColor: typeColor }]} />
            <View style={styles.routeTextContainer}>
              <Text style={[styles.routeLocation, isPast && styles.routeLocationPast]} numberOfLines={1}>
                {transport.origin}
              </Text>
              {departureTime ? (
                <Text style={styles.routeTime}>{departureTime}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.routeConnector}>
            <View style={[styles.routeLine, { backgroundColor: `${typeColor}30` }]} />
            <Ionicons name="arrow-forward" size={14} color={typeColor} />
            <View style={[styles.routeLine, { backgroundColor: `${typeColor}30` }]} />
          </View>

          <View style={styles.routeEndpoint}>
            <View style={[styles.routeDot, styles.routeDotOutline, { borderColor: typeColor }]} />
            <View style={styles.routeTextContainer}>
              <Text style={[styles.routeLocation, isPast && styles.routeLocationPast]} numberOfLines={1}>
                {transport.destination}
              </Text>
              {arrivalTime ? (
                <Text style={styles.routeTime}>{arrivalTime}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Info chips */}
        {infoChips.length > 0 && (
          <View style={styles.infoChipsRow}>
            {infoChips.map((chip, i) => (
              <View key={i} style={styles.infoChip}>
                <Text style={styles.infoChipText}>{chip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom row: reference code + attachments + cost */}
        <View style={styles.cardBottomRow}>
          {transport.referenceCode ? (
            <View style={styles.referenceCodeBadge}>
              <Ionicons name="barcode-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.referenceCodeText}>{transport.referenceCode}</Text>
            </View>
          ) : null}

          <View style={styles.cardBottomRight}>
            {(transport.attachments?.length ?? 0) > 0 && (
              <View style={styles.attachmentBadge}>
                <Ionicons name="attach" size={12} color={Colors.textTertiary} />
                <Text style={styles.attachmentCount}>{transport.attachments!.length}</Text>
              </View>
            )}

            {transport.cost !== undefined && transport.cost > 0 && (
              <Text style={styles.costText}>
                {transport.currency === 'EUR' ? '€' : transport.currency ?? '€'}
                {transport.cost.toFixed(0)}
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

export default function TransportsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TransportType | 'all'>('all');

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      const loaded = await getTripById(id);
      setTrip(loaded);
    } catch (error) {
      console.warn('[Transports] Error loading trip:', error);
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

  const handleAddTransport = useCallback(() => {
    // TODO: Navigate to add transport screen / show type selector
  }, [id]);

  const handleTransportPress = useCallback(
    (_transport: Transport) => {
      // TODO: Navigate to transport detail
    },
    [id, router]
  );

  // ─── Derived data ───────────────────────────────────────────────

  const allTransports = trip?.transports ?? [];
  const filteredTransports =
    activeFilter === 'all'
      ? allTransports
      : allTransports.filter((t) => t.type === activeFilter);

  // Sort chronologically
  const sortedTransports = [...filteredTransports].sort(
    (a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
  );

  const isEmpty = allTransports.length === 0;
  const noResults = allTransports.length > 0 && filteredTransports.length === 0;

  // Counts by type
  const countsByType: Partial<Record<TransportType, number>> = {};
  allTransports.forEach((t) => {
    countsByType[t.type] = (countsByType[t.type] ?? 0) + 1;
  });

  // Available filter chips (only show types that have transports)
  const availableFilters = FILTER_CHIPS.filter(
    (chip) => chip.key === 'all' || (countsByType[chip.key as TransportType] ?? 0) > 0
  );

  // ─── Render ─────────────────────────────────────────────────────

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando transportes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Filter bar (only when there are transports) */}
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
                  ? allTransports.length
                  : countsByType[chip.key as TransportType] ?? 0;

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
          icon="airplane-outline"
          title="Sin transportes"
          description="Añade vuelos, trenes, autobuses u otros transportes para organizar tus desplazamientos."
          actionLabel="Añadir transporte"
          onAction={handleAddTransport}
        />
      ) : noResults ? (
        <EmptyState
          icon="filter-outline"
          title="Sin resultados"
          description={`No hay transportes de tipo "${
            FILTER_CHIPS.find((c) => c.key === activeFilter)?.label ?? activeFilter
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
          {/* Transport count summary */}
          <View style={styles.listSummary}>
            <Text style={styles.listSummaryText}>
              {sortedTransports.length} transporte{sortedTransports.length !== 1 ? 's' : ''}
              {activeFilter !== 'all'
                ? ` · ${FILTER_CHIPS.find((c) => c.key === activeFilter)?.label}`
                : ''}
            </Text>
          </View>

          {sortedTransports.map((transport) => (
            <TransportCard
              key={transport.id}
              transport={transport}
              onPress={() => handleTransportPress(transport)}
            />
          ))}
        </ScrollView>
      )}

      {/* FAB */}
      <FAB
        icon="add"
        onPress={handleAddTransport}
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
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  listSummaryText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },

  // ─── Transport card ─────────────────────────────
  transportCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  transportCardPast: {
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
  cardDate: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },

  // ─── Route ──────────────────────────────────────
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  routeEndpoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
  },
  routeDotOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLocation: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  routeLocationPast: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  routeTime: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  routeConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
    marginHorizontal: Spacing.xs,
  },
  routeLine: {
    flex: 1,
    height: 1.5,
  },

  // ─── Info chips ─────────────────────────────────
  infoChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  infoChip: {
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
  },
  infoChipText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },

  // ─── Card bottom row ────────────────────────────
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referenceCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  referenceCodeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    fontFamily: undefined, // system monospace would be ideal
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
  costText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
});
