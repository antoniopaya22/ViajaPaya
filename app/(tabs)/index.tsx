import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  SectionList,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Layout } from "@/constants/theme";
import { Trip, TripStatus, getTripStatus, getDaysUntilTrip } from "@/types/trip";
import { getAllTrips } from "@/services/storage";
import TripCard from "@/components/trips/TripCard";
import EmptyState from "@/components/ui/EmptyState";
import FAB from "@/components/ui/FAB";
import WaveHeader from "@/components/ui/WaveHeader";

// ─── Section type ────────────────────────────────────────────────────

interface TripSection {
  key: TripStatus;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  data: Trip[];
}

// ─── Helper: group trips into sections ───────────────────────────────

function groupTrips(trips: Trip[]): TripSection[] {
  const upcoming: Trip[] = [];
  const ongoing: Trip[] = [];
  const past: Trip[] = [];

  for (const trip of trips) {
    const status = getTripStatus(trip);
    switch (status) {
      case "upcoming":
        upcoming.push(trip);
        break;
      case "ongoing":
        ongoing.push(trip);
        break;
      case "past":
        past.push(trip);
        break;
    }
  }

  // Sort upcoming by closest first
  upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Sort past by most recent first
  past.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  const sections: TripSection[] = [];

  if (ongoing.length > 0) {
    sections.push({
      key: "ongoing",
      title: "En curso",
      icon: "pulse-outline",
      color: Colors.tripOngoing,
      data: ongoing,
    });
  }

  if (upcoming.length > 0) {
    sections.push({
      key: "upcoming",
      title: "Próximos",
      icon: "hourglass-outline",
      color: Colors.tripUpcoming,
      data: upcoming,
    });
  }

  if (past.length > 0) {
    sections.push({
      key: "past",
      title: "Pasados",
      icon: "checkmark-circle-outline",
      color: Colors.tripPast,
      data: past,
    });
  }

  return sections;
}

// ─── Helper: filter trips by search query ────────────────────────────

function filterTrips(trips: Trip[], query: string): Trip[] {
  if (!query.trim()) return trips;
  const q = query.toLowerCase().trim();
  return trips.filter((t) => t.name.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q));
}

// ─── Component ───────────────────────────────────────────────────────

export default function TripsHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Load trips on focus
  const loadTrips = useCallback(async () => {
    try {
      const allTrips = await getAllTrips();
      setTrips(allTrips);
    } catch (error) {
      console.warn("[TripsHome] Error loading trips:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [loadTrips]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  }, [loadTrips]);

  const handleTripPress = useCallback(
    (trip: Trip) => {
      router.push(`/trip/${trip.id}`);
    },
    [router],
  );

  const handleCreateTrip = useCallback(() => {
    // TODO: Navigate to create trip screen
    // router.push('/trip/create');
  }, []);

  // ─── Derived state ──────────────────────────────────────────────

  const filteredTrips = filterTrips(trips, searchQuery);
  const sections = groupTrips(filteredTrips);

  const totalTrips = trips.length;
  const nextTrip = trips.find((t) => getTripStatus(t) === "upcoming");
  const ongoingTrip = trips.find((t) => getTripStatus(t) === "ongoing");

  const nextTripDays = nextTrip ? getDaysUntilTrip(nextTrip) : null;

  const isEmpty = totalTrips === 0;
  const noResults = totalTrips > 0 && filteredTrips.length === 0;

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <View style={styles.screen}>
      {/* ─── Header with wave ────────────────────────────────── */}
      <WaveHeader extraBottomPadding={isSearchVisible ? 4 : 0}>
        {/* Greeting row */}
        <View style={styles.headerTop}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.headerTitle}>Mis Viajes</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerIconButton, isSearchVisible && styles.headerIconButtonActive]}
              onPress={() => {
                setIsSearchVisible(!isSearchVisible);
                if (isSearchVisible) setSearchQuery("");
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSearchVisible ? "close" : "search"}
                size={20}
                color={isSearchVisible ? "#FFFFFF" : "rgba(255,255,255,0.85)"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick stats pills */}
        {!isEmpty && (
          <View style={styles.quickStats}>
            {ongoingTrip ? (
              <View style={[styles.quickStatPill, styles.quickStatPillOngoing]}>
                <View style={[styles.quickStatDot, { backgroundColor: "#FFFFFF" }]} />
                <Text style={[styles.quickStatText, styles.quickStatTextOngoing]}>1 viaje en curso</Text>
              </View>
            ) : nextTrip && nextTripDays !== null ? (
              <View style={[styles.quickStatPill, styles.quickStatPillUpcoming]}>
                <Ionicons name="calendar" size={13} color="#FFFFFF" style={styles.quickStatIcon} />
                <Text style={[styles.quickStatText, styles.quickStatTextUpcoming]}>
                  {nextTripDays === 0
                    ? "¡El viaje es hoy!"
                    : nextTripDays === 1
                      ? "Próximo viaje mañana"
                      : `Próximo viaje en ${nextTripDays} días`}
                </Text>
              </View>
            ) : null}

            <View style={styles.quickStatPillNeutral}>
              <Ionicons name="airplane" size={13} color="rgba(255,255,255,0.7)" style={styles.quickStatIcon} />
              <Text style={styles.quickStatTextNeutral}>
                {totalTrips} viaje{totalTrips !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        )}

        {/* Search bar (collapsible) */}
        {isSearchVisible && (
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre o destino..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && Platform.OS !== "ios" && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </WaveHeader>

      {/* ─── Content ─────────────────────────────────────────── */}
      {isEmpty ? (
        <EmptyState
          icon="airplane-outline"
          title="¡Empieza a planificar!"
          description="Crea tu primer viaje y organiza todos los detalles en un solo lugar."
          actionLabel="Crear viaje"
          onAction={handleCreateTrip}
        />
      ) : noResults ? (
        <EmptyState
          icon="search-outline"
          title="Sin resultados"
          description={`No se encontraron viajes para "${searchQuery}"`}
          compact
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Layout.tabBarHeight + Spacing["3xl"] + 16 },
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
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={[styles.sectionIconCircle, { backgroundColor: `${section.color}14` }]}>
                  <Ionicons name={section.icon} size={14} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.sectionCountBadge}>
                <Text style={styles.sectionCount}>{section.data.length}</Text>
              </View>
            </View>
          )}
          renderItem={({ item, section }) => (
            <View style={styles.cardWrapper}>
              <TripCard
                trip={item}
                onPress={() => handleTripPress(item)}
                variant={section.key === "ongoing" ? "featured" : "default"}
              />
            </View>
          )}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
        />
      )}

      {/* ─── FAB ─────────────────────────────────────────────── */}
      <FAB
        icon="add"
        label={isEmpty ? undefined : undefined}
        onPress={handleCreateTrip}
        style={{
          bottom: insets.bottom + Layout.tabBarHeight + Spacing.base + 8,
        }}
      />
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Buenas noches 🌙";
  if (hour < 12) return "Buenos días ☀️";
  if (hour < 20) return "Buenas tardes 🌤️";
  return "Buenas noches 🌙";
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Header ─────────────────────────────────────
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitleArea: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: "rgba(255,255,255,0.75)",
    marginBottom: Spacing.xs,
    letterSpacing: 0.1,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: FontWeights.bold,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerIconButtonActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderColor: "rgba(255,255,255,0.35)",
  },

  // ─── Quick stats ────────────────────────────────
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  quickStatPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 1,
    borderRadius: BorderRadius.full,
  },
  quickStatPillOngoing: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  quickStatPillUpcoming: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  quickStatPillNeutral: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 1,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  quickStatDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  quickStatIcon: {
    marginRight: Spacing.xs + 1,
  },
  quickStatText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.1,
  },
  quickStatTextOngoing: {
    color: "#FFFFFF",
  },
  quickStatTextUpcoming: {
    color: "#FFFFFF",
  },
  quickStatTextNeutral: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: "rgba(255,255,255,0.7)",
  },

  // ─── Search ─────────────────────────────────────
  searchContainer: {
    marginTop: Spacing.base,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 46,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: "#FFFFFF",
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },

  // ─── Section list ───────────────────────────────
  listContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  sectionCountBadge: {
    backgroundColor: Colors.secondaryMuted,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    minWidth: 28,
    alignItems: "center",
  },
  sectionCount: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textTertiary,
  },
  cardWrapper: {
    marginBottom: Spacing.xs,
  },
  sectionFooter: {
    height: Spacing.lg,
  },
});
