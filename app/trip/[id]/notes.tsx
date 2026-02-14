import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows, Layout } from "@/constants/theme";
import { Trip } from "@/types/trip";
import {
  Note,
  NoteCategory,
  NOTE_CATEGORIES,
  NOTE_ICONS,
  NOTE_COLORS,
  sortNotes,
  filterNotesByCategory,
  searchNotes,
  getNotePreview,
} from "@/types/note";
import { getTripById } from "@/services/storage";
import EmptyState from "@/components/ui/EmptyState";
import FAB from "@/components/ui/FAB";

// ─── Filter chip data ────────────────────────────────────────────────

interface FilterChip {
  key: NoteCategory | "all";
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const ALL_FILTER_CHIPS: FilterChip[] = [
  { key: "all", label: "Todas" },
  { key: "food", label: "Comida", icon: "restaurant", color: NOTE_COLORS.food },
  { key: "language", label: "Idioma", icon: "chatbubbles", color: NOTE_COLORS.language },
  { key: "directions", label: "Lugares", icon: "navigate", color: NOTE_COLORS.directions },
  { key: "emergency", label: "Emergencias", icon: "warning", color: NOTE_COLORS.emergency },
  { key: "tips", label: "Consejos", icon: "bulb", color: NOTE_COLORS.tips },
  { key: "general", label: "General", icon: "document-text", color: NOTE_COLORS.general },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
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
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? "s" : ""}`;

    const day = date.getDate();
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  } catch {
    return isoDate;
  }
}

// ─── Note Card Component ─────────────────────────────────────────────

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  searchQuery?: string;
}

function NoteCard({ note, onPress, searchQuery }: NoteCardProps) {
  const categoryIcon = note.category
    ? (NOTE_ICONS[note.category] as keyof typeof Ionicons.glyphMap)
    : ("document-text" as keyof typeof Ionicons.glyphMap);
  const categoryColor = note.category ? NOTE_COLORS[note.category] : Colors.textTertiary;
  const categoryLabel = note.category ? NOTE_CATEGORIES[note.category] : "General";
  const preview = getNotePreview(note.content, 100);
  const relativeDate = formatRelativeDate(note.updatedAt);

  return (
    <TouchableOpacity
      style={[noteCardStyles.container, Shadows.card, note.isPinned && noteCardStyles.containerPinned]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Pinned indicator */}
      {note.isPinned && (
        <View style={noteCardStyles.pinnedBanner}>
          <Ionicons name="pin" size={11} color={Colors.primary} style={noteCardStyles.pinnedIcon} />
          <Text style={noteCardStyles.pinnedText}>Fijada</Text>
        </View>
      )}

      {/* Header: category + date */}
      <View style={noteCardStyles.headerRow}>
        <View style={[noteCardStyles.categoryBadge, { backgroundColor: `${categoryColor}14` }]}>
          <Ionicons name={categoryIcon} size={12} color={categoryColor} />
          <Text style={[noteCardStyles.categoryText, { color: categoryColor }]}>{categoryLabel}</Text>
        </View>
        <Text style={noteCardStyles.dateText}>{relativeDate}</Text>
      </View>

      {/* Title */}
      <Text style={noteCardStyles.title} numberOfLines={2}>
        {note.title}
      </Text>

      {/* Preview */}
      {preview ? (
        <Text style={noteCardStyles.preview} numberOfLines={2}>
          {preview}
        </Text>
      ) : null}

      {/* Bottom row: word count indicator */}
      <View style={noteCardStyles.bottomRow}>
        <View style={noteCardStyles.contentInfo}>
          <Ionicons
            name="reader-outline"
            size={12}
            color={Colors.textTertiary}
            style={noteCardStyles.contentInfoIcon}
          />
          <Text style={noteCardStyles.contentInfoText}>{note.content.length > 200 ? "Nota larga" : "Nota corta"}</Text>
        </View>
        <Ionicons name="chevron-forward" size={Layout.iconSizeMedium} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const noteCardStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  containerPinned: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  pinnedBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  pinnedIcon: {
    marginRight: Spacing.xs,
    transform: [{ rotate: "45deg" }],
  },
  pinnedText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  dateText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
  title: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    lineHeight: FontSizes.base * 1.3,
  },
  preview: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.5,
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentInfoIcon: {
    marginRight: Spacing.xs,
  },
  contentInfoText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
});

// ─── Category Quick Access Grid (for empty state) ────────────────────

interface CategoryQuickAccessProps {
  onSelectCategory: (category: NoteCategory) => void;
}

function CategoryQuickAccess({ onSelectCategory }: CategoryQuickAccessProps) {
  const categories: NoteCategory[] = ["food", "language", "directions", "emergency", "tips", "general"];

  return (
    <View style={categoryGridStyles.container}>
      <Text style={categoryGridStyles.title}>¿Sobre qué quieres tomar nota?</Text>
      <View style={categoryGridStyles.grid}>
        {categories.map((category) => {
          const icon = NOTE_ICONS[category] as keyof typeof Ionicons.glyphMap;
          const color = NOTE_COLORS[category];
          const label = NOTE_CATEGORIES[category];

          return (
            <TouchableOpacity
              key={category}
              style={[categoryGridStyles.card, Shadows.sm]}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
            >
              <View style={[categoryGridStyles.iconCircle, { backgroundColor: `${color}14` }]}>
                <Ionicons name={icon} size={22} color={color} />
              </View>
              <Text style={categoryGridStyles.label} numberOfLines={2}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const categoryGridStyles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.lg,
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
    width: "31%",
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

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NoteCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      const loaded = await getTripById(id);
      setTrip(loaded);
    } catch (error) {
      console.warn("[Notes] Error loading trip:", error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadTrip();
    }, [loadTrip]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrip();
    setRefreshing(false);
  }, [loadTrip]);

  const handleAddNote = useCallback(() => {
    router.push({ pathname: "/note-form", params: { tripId: id } } as any);
  }, [id, router]);

  const handleAddNoteWithCategory = useCallback(
    (category: NoteCategory) => {
      router.push({ pathname: "/note-form", params: { tripId: id, category } } as any);
    },
    [id, router],
  );

  const handleNotePress = useCallback(
    (note: Note) => {
      router.push({ pathname: "/note-form", params: { tripId: id, noteId: note.id } } as any);
    },
    [id, router],
  );

  // ─── Derived data ───────────────────────────────────────────────

  const allNotes = trip?.notes ?? [];

  // Apply search filter
  const searchedNotes = searchQuery.trim() ? searchNotes(allNotes, searchQuery) : allNotes;

  // Apply category filter
  const categoryFiltered = activeFilter === "all" ? searchedNotes : filterNotesByCategory(searchedNotes, activeFilter);

  // Sort: pinned first, then by most recent
  const sortedNotes = sortNotes(categoryFiltered);

  const pinnedNotes = sortedNotes.filter((n) => n.isPinned);
  const unpinnedNotes = sortedNotes.filter((n) => !n.isPinned);

  const isEmpty = allNotes.length === 0;
  const noResults =
    allNotes.length > 0 && (categoryFiltered.length === 0 || (searchQuery.trim() && searchedNotes.length === 0));

  // Counts by category for filter chips
  const countsByCategory: Record<string, number> = {};
  allNotes.forEach((n) => {
    if (n.category) {
      countsByCategory[n.category] = (countsByCategory[n.category] ?? 0) + 1;
    }
  });

  const availableFilters = ALL_FILTER_CHIPS.filter(
    (chip) => chip.key === "all" || (countsByCategory[chip.key as NoteCategory] ?? 0) > 0,
  );

  // ─── Render ─────────────────────────────────────────────────────

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando notas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Search + filter bar */}
      {!isEmpty && (
        <View style={styles.toolbarContainer}>
          {/* Search bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={Layout.iconSizeMedium}
                color={Colors.textTertiary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar en notas..."
                placeholderTextColor={Colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && Platform.OS !== "ios" && (
                <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBarContent}
            style={styles.filterBarScroll}
          >
            {availableFilters.map((chip) => {
              const isActive = activeFilter === chip.key;
              const count = chip.key === "all" ? allNotes.length : (countsByCategory[chip.key as NoteCategory] ?? 0);

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

      {/* Content */}
      {isEmpty ? (
        <ScrollView
          contentContainerStyle={[styles.emptyScrollContent, { paddingBottom: insets.bottom + Spacing["3xl"] }]}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState
            icon="document-text-outline"
            title="Sin notas"
            description="Apunta consejos, frases útiles, direcciones, números de emergencia y cualquier información que necesites durante el viaje."
          />

          <CategoryQuickAccess onSelectCategory={handleAddNoteWithCategory} />

          {/* Tips */}
          <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={16} color={Colors.categoryNote} style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Puedes fijar las notas más importantes para que aparezcan siempre en primer lugar.
            </Text>
          </View>
        </ScrollView>
      ) : noResults ? (
        <EmptyState
          icon="search-outline"
          title="Sin resultados"
          description={
            searchQuery.trim()
              ? `No se encontraron notas para "${searchQuery}"`
              : `No hay notas en la categoría "${
                  ALL_FILTER_CHIPS.find((c) => c.key === activeFilter)?.label ?? activeFilter
                }".`
          }
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
          {/* Summary */}
          <View style={styles.listSummary}>
            <Text style={styles.listSummaryText}>
              {sortedNotes.length} nota{sortedNotes.length !== 1 ? "s" : ""}
              {searchQuery.trim() ? ` · resultados para "${searchQuery}"` : ""}
            </Text>
            {pinnedNotes.length > 0 && (
              <View style={styles.pinnedSummary}>
                <Ionicons name="pin" size={12} color={Colors.primary} style={styles.pinnedSummaryIcon} />
                <Text style={[styles.listSummaryText, { color: Colors.primary }]}>
                  {pinnedNotes.length} fijada{pinnedNotes.length !== 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Pinned notes section */}
          {pinnedNotes.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pin" size={14} color={Colors.primary} style={styles.sectionHeaderIcon} />
                <Text style={styles.sectionHeaderTitle}>Fijadas</Text>
              </View>
              {pinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onPress={() => handleNotePress(note)} searchQuery={searchQuery} />
              ))}
            </View>
          )}

          {/* Unpinned notes */}
          {unpinnedNotes.length > 0 && (
            <View style={styles.section}>
              {pinnedNotes.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="document-text-outline"
                    size={14}
                    color={Colors.textSecondary}
                    style={styles.sectionHeaderIcon}
                  />
                  <Text style={styles.sectionHeaderTitle}>Otras notas</Text>
                </View>
              )}
              {unpinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onPress={() => handleNotePress(note)} searchQuery={searchQuery} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* FAB */}
      <FAB
        icon="add"
        onPress={handleAddNote}
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

  // ─── Toolbar ────────────────────────────────────
  toolbarContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  searchRow: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: Layout.buttonHeightSmall,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },

  // ─── Filter bar ─────────────────────────────────
  filterBarScroll: {
    // no extra styles needed
  },
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
    justifyContent: "center",
    alignItems: "center",
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
  pinnedSummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  pinnedSummaryIcon: {
    marginRight: Spacing.xs,
    transform: [{ rotate: "45deg" }],
  },

  // ─── Sections ───────────────────────────────────
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  sectionHeaderIcon: {
    marginRight: Spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // ─── Empty state ────────────────────────────────
  emptyScrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.warningMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
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
