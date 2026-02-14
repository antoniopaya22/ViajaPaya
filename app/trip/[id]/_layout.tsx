import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from "react-native";
import { Slot, useRouter, usePathname, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from "@/constants/theme";
import WaveHeader from "@/components/ui/WaveHeader";
import {
  Trip,
  getTripStatus,
  getTripDurationDays,
  getDaysUntilTrip,
  getCurrentDayOfTrip,
  TripStatus,
} from "@/types/trip";
import { getTripById } from "@/services/storage";
import StatusBadge from "@/components/ui/StatusBadge";

// ─── Tab definitions ─────────────────────────────────────────────────

interface TabDef {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

const TABS: TabDef[] = [
  {
    key: "summary",
    label: "Resumen",
    icon: "grid-outline",
    iconActive: "grid",
    color: Colors.primary,
    route: "",
  },
  {
    key: "timeline",
    label: "Timeline",
    icon: "time-outline",
    iconActive: "time",
    color: "#667EEA",
    route: "/timeline",
  },
  {
    key: "transports",
    label: "Transportes",
    icon: "airplane-outline",
    iconActive: "airplane",
    color: Colors.categoryTransport,
    route: "/transports",
  },
  {
    key: "accommodations",
    label: "Alojamiento",
    icon: "bed-outline",
    iconActive: "bed",
    color: Colors.categoryAccommodation,
    route: "/accommodations",
  },
  {
    key: "activities",
    label: "Actividades",
    icon: "ticket-outline",
    iconActive: "ticket",
    color: Colors.categoryActivity,
    route: "/activities",
  },
  {
    key: "budget",
    label: "Presupuesto",
    icon: "cash-outline",
    iconActive: "cash",
    color: Colors.categoryExpense,
    route: "/budget",
  },
  {
    key: "checklist",
    label: "Equipaje",
    icon: "checkbox-outline",
    iconActive: "checkbox",
    color: Colors.categoryChecklist,
    route: "/checklist",
  },
  {
    key: "notes",
    label: "Notas",
    icon: "document-text-outline",
    iconActive: "document-text",
    color: Colors.categoryNote,
    route: "/notes",
  },
  {
    key: "documents",
    label: "Documentos",
    icon: "folder-open-outline",
    iconActive: "folder-open",
    color: Colors.categoryDocument,
    route: "/documents",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const sDay = start.getDate();
    const sMonth = months[start.getMonth()];
    const eDay = end.getDate();
    const eMonth = months[end.getMonth()];
    const eYear = end.getFullYear();

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${sDay} – ${eDay} ${sMonth} ${eYear}`;
    }
    return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${eYear}`;
  } catch {
    return `${startDate} – ${endDate}`;
  }
}

function getStatusCountdown(status: TripStatus, daysUntil: number, currentDay?: number, totalDays?: number): string {
  switch (status) {
    case "upcoming":
      if (daysUntil === 0) return "¡Empieza hoy!";
      if (daysUntil === 1) return "¡Mañana!";
      return `Faltan ${daysUntil} días`;
    case "ongoing":
      if (currentDay && totalDays) {
        return `Día ${currentDay} de ${totalDays}`;
      }
      return "En curso";
    case "past":
      return "Finalizado";
    default:
      return "";
  }
}

// ─── Component ───────────────────────────────────────────────────────

export default function TripDetailLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const tabScrollRef = useRef<ScrollView>(null);
  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Load trip data
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const loadedTrip = await getTripById(id);
        setTrip(loadedTrip);
      } catch (error) {
        console.warn("[TripDetail] Error loading trip:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Determine active tab from pathname
  const activeTabKey =
    TABS.find((tab) => {
      if (tab.route === "") {
        // Summary tab is the index route
        const basePath = `/trip/${id}`;
        return pathname === basePath || pathname === `${basePath}/`;
      }
      return pathname.endsWith(tab.route);
    })?.key ?? "summary";

  // Navigate to a tab
  const handleTabPress = useCallback(
    (tab: TabDef) => {
      const basePath = `/trip/${id}`;
      const fullPath = tab.route === "" ? basePath : `${basePath}${tab.route}`;
      router.replace(fullPath as any);
    },
    [id, router],
  );

  // Scroll active tab into view
  useEffect(() => {
    const activeIndex = TABS.findIndex((t) => t.key === activeTabKey);
    if (activeIndex >= 0 && tabScrollRef.current) {
      // Approximate scroll position
      const scrollTo = Math.max(0, activeIndex * 100 - 40);
      tabScrollRef.current.scrollTo({ x: scrollTo, animated: true });
    }
  }, [activeTabKey]);

  // Back navigation
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Edit trip
  const handleEditTrip = useCallback(() => {
    // TODO: Navigate to trip edit screen
  }, []);

  // ─── Loading state ──────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando viaje...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Viaje no encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Trip derived data ──────────────────────────────────────────

  const status = getTripStatus(trip);
  const durationDays = getTripDurationDays(trip);
  const daysUntil = getDaysUntilTrip(trip);
  const currentDay = status === "ongoing" ? getCurrentDayOfTrip(trip) : undefined;
  const dateRange = formatDateRange(trip.startDate, trip.endDate);
  const countdownText = getStatusCountdown(status, daysUntil, currentDay, durationDays);

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <View style={styles.screen}>
      {/* ─── Compact Header with wave ────────────────────────── */}
      <Animated.View style={{ opacity: headerOpacity }}>
        <WaveHeader waveHeight={40} extraBottomPadding={4} overridePaddingTop={insets.top}>
          {/* Top bar: back, title, actions */}
          <View style={styles.headerTopBar}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleArea}>
              <Text style={styles.headerTripName} numberOfLines={1}>
                {trip.name}
              </Text>
              <View style={styles.headerSubtitleRow}>
                <Ionicons name="location" size={12} color="rgba(255,255,255,0.8)" style={styles.headerLocationIcon} />
                <Text style={styles.headerDestination} numberOfLines={1}>
                  {trip.destination}
                </Text>
                <Text style={styles.headerDot}>·</Text>
                <Text style={styles.headerDates}>{dateRange}</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <StatusBadge status={status} size="sm" showIcon={false} />
              <TouchableOpacity style={styles.headerActionButton} onPress={handleEditTrip} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Countdown chip */}
          <View style={styles.countdownRow}>
            <View style={[styles.countdownChip, { backgroundColor: getStatusBgColor(status) }]}>
              <Ionicons
                name={getStatusIcon(status)}
                size={13}
                color={getStatusTextColor(status)}
                style={styles.countdownIcon}
              />
              <Text style={[styles.countdownText, { color: getStatusTextColor(status) }]}>{countdownText}</Text>
            </View>
            <View style={styles.durationPill}>
              <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.65)" style={styles.durationIcon} />
              <Text style={styles.durationText}>
                {durationDays} día{durationDays !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* ─── Scrollable tab bar ───────────────────────────── */}
          <ScrollView
            ref={tabScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarContent}
            style={styles.tabBarScroll}
          >
            {TABS.map((tab) => {
              const isActive = tab.key === activeTabKey;

              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => handleTabPress(tab)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isActive ? tab.iconActive : tab.icon}
                    size={16}
                    color={isActive ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
                    style={styles.tabIcon}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </WaveHeader>
      </Animated.View>

      {/* ─── Screen content (Slot renders active child route) ─ */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

// ─── Status helpers ──────────────────────────────────────────────────

function getStatusBgColor(status: TripStatus): string {
  switch (status) {
    case "upcoming":
      return "rgba(255,255,255,0.18)";
    case "ongoing":
      return "rgba(255,255,255,0.22)";
    case "past":
      return "rgba(255,255,255,0.12)";
    default:
      return "rgba(255,255,255,0.10)";
  }
}

function getStatusTextColor(status: TripStatus): string {
  switch (status) {
    case "upcoming":
      return "#FFFFFF";
    case "ongoing":
      return "#FFFFFF";
    case "past":
      return "rgba(255,255,255,0.75)";
    default:
      return "rgba(255,255,255,0.6)";
  }
}

function getStatusIcon(status: TripStatus): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "upcoming":
      return "hourglass-outline";
    case "ongoing":
      return "navigate-outline";
    case "past":
      return "checkmark-circle-outline";
    default:
      return "help-circle-outline";
  }
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Loading / Error ────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textInverse,
  },

  // ─── Header ─────────────────────────────────────
  headerTopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -4,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  headerBackButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  headerTitleArea: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  headerTripName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#FFFFFF",
    lineHeight: FontSizes.lg * 1.2,
    letterSpacing: -0.2,
  },
  headerSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  headerLocationIcon: {
    marginRight: 3,
  },
  headerDestination: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: "rgba(255,255,255,0.8)",
    maxWidth: 110,
  },
  headerDot: {
    fontSize: FontSizes.xs,
    color: "rgba(255,255,255,0.5)",
    marginHorizontal: Spacing.xs,
  },
  headerDates: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: "rgba(255,255,255,0.65)",
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerActionButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ─── Countdown row ──────────────────────────────
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  countdownChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
  },
  countdownIcon: {
    marginRight: Spacing.xs,
  },
  countdownText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.1,
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
  },
  durationIcon: {
    marginRight: Spacing.xs,
  },
  durationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: "rgba(255,255,255,0.7)",
  },

  // ─── Tab bar ────────────────────────────────────
  tabBarScroll: {
    marginHorizontal: -20,
  },
  tabBarContent: {
    paddingHorizontal: 20,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 1,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  tabActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  tabIcon: {
    marginRight: Spacing.xs,
  },
  tabLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: "rgba(255,255,255,0.55)",
  },
  tabLabelActive: {
    fontWeight: FontWeights.bold,
    color: "#FFFFFF",
  },

  // ─── Content ────────────────────────────────────
  content: {
    flex: 1,
  },
});
