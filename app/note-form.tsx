import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { NoteCategory, NOTE_COLORS, createNote, NoteFormData } from "@/types/note";
import { getTripById, updateTrip } from "@/services/storage";
import { Trip } from "@/types/trip";

// ─── Category selector data ─────────────────────────────────────────

interface CategoryOption {
  key: NoteCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: "general", label: "General", icon: "document-text", color: NOTE_COLORS.general },
  { key: "food", label: "Restaurantes y comida", icon: "restaurant", color: NOTE_COLORS.food },
  { key: "language", label: "Idioma y frases", icon: "chatbubbles", color: NOTE_COLORS.language },
  { key: "directions", label: "Direcciones y lugares", icon: "navigate", color: NOTE_COLORS.directions },
  { key: "emergency", label: "Emergencias", icon: "warning", color: NOTE_COLORS.emergency },
  { key: "tips", label: "Consejos y tips", icon: "bulb", color: NOTE_COLORS.tips },
];

// ─── Main Component ──────────────────────────────────────────────────

export default function NoteFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    tripId: string;
    noteId?: string;
    category?: string;
  }>();

  const { tripId, noteId, category: preselectedCategory } = params;
  const isEditing = !!noteId;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>(
    (preselectedCategory as NoteCategory) || "general",
  );
  const [isPinned, setIsPinned] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const contentInputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);

  // ─── Load data ────────────────────────────────────────────────────

  useEffect(() => {
    loadData();
  }, [tripId, noteId]);

  const loadData = async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    try {
      const loadedTrip = await getTripById(tripId);
      if (!loadedTrip) {
        setLoading(false);
        return;
      }
      setTrip(loadedTrip);

      if (noteId) {
        const existingNote = loadedTrip.notes.find((n) => n.id === noteId);
        if (existingNote) {
          setTitle(existingNote.title);
          setContent(existingNote.content);
          setSelectedCategory(existingNote.category || "general");
          setIsPinned(existingNote.isPinned);
        }
      }
    } catch (error) {
      console.warn("[NoteForm] Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Track changes ────────────────────────────────────────────────

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
    setHasChanges(true);
  }, []);

  const handleContentChange = useCallback((text: string) => {
    setContent(text);
    setHasChanges(true);
  }, []);

  const handleCategoryChange = useCallback((cat: NoteCategory) => {
    setSelectedCategory(cat);
    setShowCategoryPicker(false);
    setHasChanges(true);
  }, []);

  const handlePinToggle = useCallback(() => {
    setIsPinned((prev) => !prev);
    setHasChanges(true);
  }, []);

  // ─── Save ─────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (!trip || !tripId) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      Alert.alert("Nota vacía", "Escribe un título o contenido para guardar la nota.", [{ text: "OK" }]);
      return;
    }

    setSaving(true);

    try {
      const updatedTrip = { ...trip };

      if (isEditing && noteId) {
        // Update existing note
        const noteIndex = updatedTrip.notes.findIndex((n) => n.id === noteId);
        if (noteIndex !== -1) {
          updatedTrip.notes[noteIndex] = {
            ...updatedTrip.notes[noteIndex],
            title: trimmedTitle || "Sin título",
            content: trimmedContent,
            category: selectedCategory,
            isPinned,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        // Create new note
        const formData: NoteFormData = {
          title: trimmedTitle || "Sin título",
          content: trimmedContent,
          category: selectedCategory,
          isPinned,
        };
        const newNote = createNote(tripId, formData);
        updatedTrip.notes.push(newNote);
      }

      updatedTrip.updatedAt = new Date().toISOString();
      await updateTrip(updatedTrip);
      setHasChanges(false);
      router.back();
    } catch (error) {
      console.warn("[NoteForm] Error saving note:", error);
      Alert.alert("Error", "No se pudo guardar la nota. Inténtalo de nuevo.", [{ text: "OK" }]);
    } finally {
      setSaving(false);
    }
  }, [trip, tripId, noteId, isEditing, title, content, selectedCategory, isPinned, router]);

  // ─── Delete ───────────────────────────────────────────────────────

  const handleDelete = useCallback(() => {
    if (!trip || !tripId || !noteId) return;

    Alert.alert("Eliminar nota", "¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedTrip = { ...trip };
            updatedTrip.notes = updatedTrip.notes.filter((n) => n.id !== noteId);
            updatedTrip.updatedAt = new Date().toISOString();
            await updateTrip(updatedTrip);
            router.back();
          } catch (error) {
            console.warn("[NoteForm] Error deleting note:", error);
            Alert.alert("Error", "No se pudo eliminar la nota.", [{ text: "OK" }]);
          }
        },
      },
    ]);
  }, [trip, tripId, noteId, router]);

  // ─── Discard confirmation ─────────────────────────────────────────

  const handleGoBack = useCallback(() => {
    if (hasChanges) {
      Alert.alert("Descartar cambios", "¿Deseas salir sin guardar los cambios?", [
        { text: "Seguir editando", style: "cancel" },
        {
          text: "Descartar",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  }, [hasChanges, router]);

  // ─── Derived ──────────────────────────────────────────────────────

  const activeCategoryOption = CATEGORY_OPTIONS.find((c) => c.key === selectedCategory) || CATEGORY_OPTIONS[0];

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const canSave = (title.trim().length > 0 || content.trim().length > 0) && hasChanges;

  // ─── Loading ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.loadingText}>Viaje no encontrado</Text>
        <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}>
          <Text style={styles.errorBackText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ─── Header ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isEditing ? "Editar nota" : "Nueva nota"}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {trip.name}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {isEditing && (
            <TouchableOpacity style={styles.headerDeleteButton} onPress={handleDelete} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave || saving}
            activeOpacity={0.7}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.textInverse} />
            ) : (
              <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Form ────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + Spacing["3xl"] }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Category & Pin row ────────────────────────── */}
          <View style={styles.metaRow}>
            {/* Category selector */}
            <TouchableOpacity
              style={[styles.categoryChip, { backgroundColor: `${activeCategoryOption.color}14` }]}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              activeOpacity={0.7}
            >
              <Ionicons name={activeCategoryOption.icon} size={16} color={activeCategoryOption.color} />
              <Text style={[styles.categoryChipText, { color: activeCategoryOption.color }]}>
                {activeCategoryOption.label}
              </Text>
              <Ionicons
                name={showCategoryPicker ? "chevron-up" : "chevron-down"}
                size={14}
                color={activeCategoryOption.color}
              />
            </TouchableOpacity>

            {/* Pin toggle */}
            <TouchableOpacity
              style={[styles.pinButton, isPinned && styles.pinButtonActive]}
              onPress={handlePinToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPinned ? "pin" : "pin-outline"}
                size={16}
                color={isPinned ? Colors.primary : Colors.textTertiary}
                style={styles.pinIcon}
              />
              <Text style={[styles.pinButtonText, isPinned && styles.pinButtonTextActive]}>
                {isPinned ? "Fijada" : "Fijar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ─── Category picker dropdown ──────────────────── */}
          {showCategoryPicker && (
            <View style={[styles.categoryPicker, Shadows.md]}>
              {CATEGORY_OPTIONS.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryPickerItem,
                      isActive && styles.categoryPickerItemActive,
                      isActive && {
                        backgroundColor: `${cat.color}14`,
                      },
                    ]}
                    onPress={() => handleCategoryChange(cat.key)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryPickerIcon, { backgroundColor: `${cat.color}20` }]}>
                      <Ionicons name={cat.icon} size={18} color={cat.color} />
                    </View>
                    <Text
                      style={[
                        styles.categoryPickerText,
                        isActive && { color: cat.color, fontWeight: FontWeights.semibold },
                      ]}
                    >
                      {cat.label}
                    </Text>
                    {isActive && <Ionicons name="checkmark-circle" size={18} color={cat.color} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ─── Title input ───────────────────────────────── */}
          <TextInput
            ref={titleInputRef}
            style={styles.titleInput}
            placeholder="Título de la nota"
            placeholderTextColor={Colors.textTertiary}
            value={title}
            onChangeText={handleTitleChange}
            returnKeyType="next"
            onSubmitEditing={() => contentInputRef.current?.focus()}
            maxLength={200}
            multiline={false}
          />

          {/* ─── Content input ─────────────────────────────── */}
          <TextInput
            ref={contentInputRef}
            style={styles.contentInput}
            placeholder="Escribe aquí tu nota...&#10;&#10;Puedes anotar consejos, frases útiles, direcciones, números de contacto o cualquier información importante para tu viaje."
            placeholderTextColor={Colors.textTertiary}
            value={content}
            onChangeText={handleContentChange}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />

          {/* ─── Word/char count ───────────────────────────── */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="text-outline" size={13} color={Colors.textTertiary} style={styles.statIcon} />
              <Text style={styles.statText}>
                {charCount} caractere{charCount !== 1 ? "s" : ""}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="reader-outline" size={13} color={Colors.textTertiary} style={styles.statIcon} />
              <Text style={styles.statText}>
                {wordCount} palabra{wordCount !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* ─── Quick templates (only for new notes) ──────── */}
          {!isEditing && !content.trim() && (
            <View style={styles.templatesSection}>
              <Text style={styles.templatesTitle}>Plantillas rápidas</Text>
              <View style={styles.templatesGrid}>
                <TouchableOpacity
                  style={[styles.templateCard, Shadows.sm]}
                  onPress={() => {
                    handleTitleChange("Restaurantes recomendados");
                    handleContentChange(
                      "🍽️ Restaurante:\n📍 Dirección:\n💰 Precio aprox:\n⭐ Recomendación:\n📝 Notas:\n",
                    );
                    handleCategoryChange("food");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="restaurant" size={20} color={NOTE_COLORS.food} />
                  <Text style={styles.templateLabel}>Restaurantes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.templateCard, Shadows.sm]}
                  onPress={() => {
                    handleTitleChange("Frases útiles");
                    handleContentChange(
                      "🗣️ Frases básicas:\n\nHola → \nGracias → \nPor favor → \nPerdone → \n¿Cuánto cuesta? → \n¿Dónde está...? → \nLa cuenta, por favor → \n",
                    );
                    handleCategoryChange("language");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubbles" size={20} color={NOTE_COLORS.language} />
                  <Text style={styles.templateLabel}>Frases útiles</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.templateCard, Shadows.sm]}
                  onPress={() => {
                    handleTitleChange("Números de emergencia");
                    handleContentChange(
                      "🚨 Emergencias:\n\n📞 Policía: \n📞 Ambulancia: \n📞 Bomberos: \n📞 Embajada: \n📞 Seguro de viaje: \n🏥 Hospital más cercano: \n",
                    );
                    handleCategoryChange("emergency");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="warning" size={20} color={NOTE_COLORS.emergency} />
                  <Text style={styles.templateLabel}>Emergencias</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.templateCard, Shadows.sm]}
                  onPress={() => {
                    handleTitleChange("Lugares por visitar");
                    handleContentChange(
                      "📍 Lugar:\n🕐 Horario:\n💰 Entrada:\n🚌 Cómo llegar:\n📝 Notas:\n\n---\n\n📍 Lugar:\n🕐 Horario:\n💰 Entrada:\n🚌 Cómo llegar:\n📝 Notas:\n",
                    );
                    handleCategoryChange("directions");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="navigate" size={20} color={NOTE_COLORS.directions} />
                  <Text style={styles.templateLabel}>Lugares</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  errorBackButton: {
    marginTop: Spacing.base,
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  errorBackText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },

  // ─── Header ─────────────────────────────────────────────────

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  headerTitleArea: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerDeleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.errorMuted,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.border,
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textInverse,
  },
  saveButtonTextDisabled: {
    color: Colors.textTertiary,
  },

  // ─── Form content ──────────────────────────────────────────

  formContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },

  // ─── Meta row (category + pin) ─────────────────────────────

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  categoryChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  pinButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondaryMuted,
  },
  pinButtonActive: {
    backgroundColor: Colors.primaryMuted,
  },
  pinIcon: {
    transform: [{ rotate: "45deg" }],
  },
  pinButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
    marginLeft: Spacing.xs,
  },
  pinButtonTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },

  // ─── Category picker ───────────────────────────────────────

  categoryPicker: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderLight,
  },
  categoryPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  categoryPickerItemActive: {
    borderBottomColor: "transparent",
  },
  categoryPickerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  categoryPickerText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },

  // ─── Title input ───────────────────────────────────────────

  titleInput: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },

  // ─── Content input ─────────────────────────────────────────

  contentInput: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 24,
    minHeight: 200,
    paddingVertical: Spacing.sm,
  },

  // ─── Stats row ─────────────────────────────────────────────

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    marginRight: Spacing.xs,
  },
  statText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.md,
  },

  // ─── Templates ─────────────────────────────────────────────

  templatesSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  templatesTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  templatesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  templateCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "47%" as any,
    flex: 1,
    gap: Spacing.sm,
  },
  templateLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    textAlign: "center",
  },
});
