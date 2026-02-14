import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows, Layout } from "@/constants/theme";
import { Trip } from "@/types/trip";
import { getTripById } from "@/services/storage";
import EmptyState from "@/components/ui/EmptyState";
import FAB from "@/components/ui/FAB";

// ─── Document type definitions ───────────────────────────────────────

export type TripDocumentType =
  | "boarding_pass"
  | "hotel_booking"
  | "car_rental"
  | "activity_ticket"
  | "travel_insurance"
  | "visa"
  | "itinerary"
  | "receipt"
  | "other";

interface DocTypeConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}

const DOC_TYPE_CONFIG: Record<TripDocumentType, DocTypeConfig> = {
  boarding_pass: {
    label: "Tarjeta de embarque",
    icon: "airplane",
    color: "#4299E1",
    description: "Tarjetas de embarque y billetes",
  },
  hotel_booking: {
    label: "Reserva de hotel",
    icon: "bed",
    color: "#9F7AEA",
    description: "Confirmaciones de alojamiento",
  },
  car_rental: {
    label: "Alquiler de coche",
    icon: "car",
    color: "#48BB78",
    description: "Reservas de vehículos",
  },
  activity_ticket: {
    label: "Entrada / Ticket",
    icon: "ticket",
    color: "#ED8936",
    description: "Entradas a actividades y eventos",
  },
  travel_insurance: {
    label: "Seguro de viaje",
    icon: "shield-checkmark",
    color: "#38B2AC",
    description: "Pólizas y coberturas",
  },
  visa: {
    label: "Visado",
    icon: "document-attach",
    color: "#E53E3E",
    description: "Visados y permisos",
  },
  itinerary: {
    label: "Itinerario",
    icon: "map",
    color: "#667EEA",
    description: "Planes de viaje y rutas",
  },
  receipt: {
    label: "Recibo / Factura",
    icon: "receipt",
    color: "#D69E2E",
    description: "Comprobantes de pago",
  },
  other: {
    label: "Otro documento",
    icon: "document-text",
    color: "#A0AEC0",
    description: "Otros documentos del viaje",
  },
};

const DOC_TYPES_ORDER: TripDocumentType[] = [
  "boarding_pass",
  "hotel_booking",
  "car_rental",
  "activity_ticket",
  "travel_insurance",
  "visa",
  "itinerary",
  "receipt",
  "other",
];

// ─── Trip document interface ─────────────────────────────────────────

export interface TripDocument {
  id: string;
  tripId: string;
  type: TripDocumentType;
  name: string;
  description?: string;
  referenceNumber?: string;
  date?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Filter chip type ────────────────────────────────────────────────

interface FilterChip {
  key: TripDocumentType | "all";
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const ALL_FILTER_CHIPS: FilterChip[] = [
  { key: "all", label: "Todos" },
  { key: "boarding_pass", label: "Embarque", icon: "airplane", color: DOC_TYPE_CONFIG.boarding_pass.color },
  { key: "hotel_booking", label: "Hotel", icon: "bed", color: DOC_TYPE_CONFIG.hotel_booking.color },
  { key: "activity_ticket", label: "Entradas", icon: "ticket", color: DOC_TYPE_CONFIG.activity_ticket.color },
  { key: "car_rental", label: "Coche", icon: "car", color: DOC_TYPE_CONFIG.car_rental.color },
  { key: "travel_insurance", label: "Seguro", icon: "shield-checkmark", color: DOC_TYPE_CONFIG.travel_insurance.color },
  { key: "itinerary", label: "Itinerario", icon: "map", color: DOC_TYPE_CONFIG.itinerary.color },
  { key: "receipt", label: "Recibos", icon: "receipt", color: DOC_TYPE_CONFIG.receipt.color },
  { key: "other", label: "Otros", icon: "document-text", color: DOC_TYPE_CONFIG.other.color },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Ahora mismo";
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;

    const day = date.getDate();
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  } catch {
    return "";
  }
}

function formatDocDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

// ─── Document Card Component ─────────────────────────────────────────

interface DocumentCardProps {
  document: TripDocument;
  onPress: () => void;
  onDelete: () => void;
}

function DocumentCard({ document, onPress, onDelete }: DocumentCardProps) {
  const typeConfig = DOC_TYPE_CONFIG[document.type];
  const relativeDate = formatRelativeDate(document.updatedAt);

  const handleLongPress = useCallback(() => {
    Alert.alert(document.name, "¿Qué quieres hacer con este documento?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Editar", onPress },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  }, [document.name, onPress, onDelete]);

  return (
    <TouchableOpacity
      style={[cardStyles.container, Shadows.card]}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      {/* Left icon */}
      <View style={[cardStyles.iconContainer, { backgroundColor: `${typeConfig.color}14` }]}>
        <Ionicons name={typeConfig.icon} size={22} color={typeConfig.color} />
      </View>

      {/* Content */}
      <View style={cardStyles.content}>
        <Text style={cardStyles.name} numberOfLines={1}>
          {document.name}
        </Text>

        <View style={cardStyles.metaRow}>
          <View style={[cardStyles.typeBadge, { backgroundColor: `${typeConfig.color}14` }]}>
            <Text style={[cardStyles.typeText, { color: typeConfig.color }]}>{typeConfig.label}</Text>
          </View>
          {document.referenceNumber && (
            <Text style={cardStyles.refNumber} numberOfLines={1}>
              #{document.referenceNumber}
            </Text>
          )}
        </View>

        <View style={cardStyles.bottomRow}>
          {document.date && (
            <View style={cardStyles.dateInfo}>
              <Ionicons name="calendar-outline" size={12} color={Colors.textTertiary} style={cardStyles.dateIcon} />
              <Text style={cardStyles.dateText}>{formatDocDate(document.date)}</Text>
            </View>
          )}
          {document.description && (
            <Text style={cardStyles.description} numberOfLines={1}>
              {document.description}
            </Text>
          )}
          {!document.date && !document.description && (
            <Text style={cardStyles.updatedText}>Actualizado {relativeDate}</Text>
          )}
        </View>
      </View>

      {/* Right arrow */}
      <Ionicons name="chevron-forward" size={Layout.iconSizeMedium} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  typeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  refNumber: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    maxWidth: 120,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    marginRight: 3,
  },
  dateText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
  description: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
  updatedText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
});

// ─── Category Quick-Access Grid ──────────────────────────────────────

interface DocTypeGridProps {
  onSelectType: (type: TripDocumentType) => void;
}

function DocTypeGrid({ onSelectType }: DocTypeGridProps) {
  return (
    <View style={gridStyles.container}>
      <Text style={gridStyles.title}>¿Qué documento quieres añadir?</Text>
      <View style={gridStyles.grid}>
        {DOC_TYPES_ORDER.map((type) => {
          const config = DOC_TYPE_CONFIG[type];
          return (
            <TouchableOpacity
              key={type}
              style={[gridStyles.card, Shadows.sm]}
              onPress={() => onSelectType(type)}
              activeOpacity={0.7}
            >
              <View style={[gridStyles.iconCircle, { backgroundColor: `${config.color}14` }]}>
                <Ionicons name={config.icon} size={22} color={config.color} />
              </View>
              <Text style={gridStyles.label} numberOfLines={2}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const gridStyles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.base,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  card: {
    width: "31%" as any,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    textAlign: "center",
  },
});

// ─── Main Component ──────────────────────────────────────────────────

export default function TripDocumentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TripDocumentType | "all">("all");

  // We store trip documents inside the trip object under a custom key.
  // Since Trip type doesn't have a "documents" array, we'll store them
  // serialised inside a note with a special marker, OR we extend the
  // approach by using a local state that persists via a dedicated storage key.
  //
  // For simplicity and forward-compatibility, we use AsyncStorage with
  // a trip-scoped key for trip documents.

  const [documents, setDocuments] = useState<TripDocument[]>([]);

  // ─── Load ───────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const loadedTrip = await getTripById(id);
      setTrip(loadedTrip);

      // Load trip documents from AsyncStorage
      const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
      const raw = await AsyncStorage.getItem(`@viajapaya/trip_docs_${id}`);
      if (raw) {
        setDocuments(JSON.parse(raw));
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.warn("[TripDocuments] Error loading:", error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // ─── Persist helpers ────────────────────────────────────────────

  const persistDocuments = useCallback(
    async (docs: TripDocument[]) => {
      try {
        const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
        await AsyncStorage.setItem(`@viajapaya/trip_docs_${id}`, JSON.stringify(docs));
      } catch (error) {
        console.warn("[TripDocuments] Error persisting:", error);
      }
    },
    [id],
  );

  // ─── CRUD handlers ─────────────────────────────────────────────

  const handleAddDocument = useCallback(
    (type?: TripDocumentType) => {
      // Navigate to document form with optional pre-selected type
      router.push({
        pathname: "/document-form",
        params: {
          tripId: id,
          ...(type ? { docType: type } : {}),
        },
      } as any);
    },
    [id, router],
  );

  const handleDocumentPress = useCallback(
    (doc: TripDocument) => {
      router.push({
        pathname: "/document-form",
        params: {
          tripId: id,
          docId: doc.id,
        },
      } as any);
    },
    [id, router],
  );

  const handleDeleteDocument = useCallback(
    (doc: TripDocument) => {
      Alert.alert("Eliminar documento", `¿Estás seguro de que quieres eliminar "${doc.name}"?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const updated = documents.filter((d) => d.id !== doc.id);
            setDocuments(updated);
            await persistDocuments(updated);
          },
        },
      ]);
    },
    [documents, persistDocuments],
  );

  // ─── Derived data ──────────────────────────────────────────────

  const filteredDocuments = activeFilter === "all" ? documents : documents.filter((d) => d.type === activeFilter);

  const isEmpty = documents.length === 0;
  const noResults = documents.length > 0 && filteredDocuments.length === 0;

  // Counts by type for filter chips
  const countsByType: Partial<Record<TripDocumentType, number>> = {};
  documents.forEach((d) => {
    countsByType[d.type] = (countsByType[d.type] ?? 0) + 1;
  });

  const availableFilters = ALL_FILTER_CHIPS.filter(
    (chip) => chip.key === "all" || (countsByType[chip.key as TripDocumentType] ?? 0) > 0,
  );

  // Group documents by type for better presentation
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // ─── Render ────────────────────────────────────────────────────

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando documentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* ─── Filter bar (shown when there are documents) ───── */}
      {!isEmpty && (
        <View style={styles.toolbarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBarContent}
            style={styles.filterBarScroll}
          >
            {availableFilters.map((chip) => {
              const isActive = activeFilter === chip.key;
              const count = chip.key === "all" ? documents.length : (countsByType[chip.key as TripDocumentType] ?? 0);

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
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{chip.label}</Text>
                  <View style={[styles.filterCountBadge, isActive && styles.filterCountBadgeActive]}>
                    <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ─── Content ─────────────────────────────────────────── */}
      {isEmpty ? (
        <ScrollView
          contentContainerStyle={[styles.emptyScrollContent, { paddingBottom: insets.bottom + Spacing["3xl"] }]}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState
            icon="folder-open-outline"
            title="Sin documentos del viaje"
            description="Guarda aquí las tarjetas de embarque, reservas de hotel, entradas a actividades y cualquier documento importante del viaje."
          />

          <DocTypeGrid onSelectType={(type) => handleAddDocument(type)} />

          {/* Tip */}
          <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={16} color={Colors.categoryDocument} style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Mantén copias digitales de todos tus documentos de viaje. Así los tendrás siempre a mano aunque pierdas
              los originales.
            </Text>
          </View>
        </ScrollView>
      ) : noResults ? (
        <EmptyState
          icon="document-text-outline"
          title="Sin resultados"
          description={`No hay documentos de tipo "${
            ALL_FILTER_CHIPS.find((c) => c.key === activeFilter)?.label ?? activeFilter
          }".`}
          compact
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing["3xl"] }]}
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
          {/* Summary row */}
          <View style={styles.listSummary}>
            <Text style={styles.listSummaryText}>
              {sortedDocuments.length} documento{sortedDocuments.length !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.listSummaryText}>
              {Object.keys(countsByType).length} tipo{Object.keys(countsByType).length !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* Document cards */}
          {sortedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPress={() => handleDocumentPress(doc)}
              onDelete={() => handleDeleteDocument(doc)}
            />
          ))}
        </ScrollView>
      )}

      {/* ─── FAB ─────────────────────────────────────────────── */}
      <FAB
        icon="add"
        onPress={() => handleAddDocument()}
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
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },

  // ─── Toolbar ────────────────────────────────────────────────
  toolbarContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  filterBarScroll: {},
  filterBarContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
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
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
  },
  filterCountBadgeActive: {
    backgroundColor: Colors.primary,
  },
  filterCountText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  filterCountTextActive: {
    color: Colors.textInverse,
  },

  // ─── List ───────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
  },
  listSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  listSummaryText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },

  // ─── Empty state ────────────────────────────────────────────
  emptyScrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.infoMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
  },
  tipIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.6,
  },
});
