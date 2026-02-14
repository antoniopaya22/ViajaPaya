import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
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
  ChecklistItem,
  ChecklistCategory,
  CHECKLIST_CATEGORIES,
  CHECKLIST_ICONS,
  CHECKLIST_COLORS,
  TemplateType,
  TEMPLATE_NAMES,
  TEMPLATE_ICONS,
  CHECKLIST_TEMPLATES,
  getChecklistProgress,
  getChecklistByCategory,
  getCategoryProgress,
  createChecklistItem,
} from '@/types/checklist';
import { getTripById, updateTrip } from '@/services/storage';
import EmptyState from '@/components/ui/EmptyState';

// ─── Category order for display ──────────────────────────────────────

const CATEGORY_ORDER: ChecklistCategory[] = [
  'clothing',
  'technology',
  'documents',
  'hygiene',
  'medication',
  'accessories',
  'other',
];

// ─── Helpers ─────────────────────────────────────────────────────────

function getCategoryIcon(category: ChecklistCategory): keyof typeof Ionicons.glyphMap {
  return CHECKLIST_ICONS[category] as keyof typeof Ionicons.glyphMap;
}

// ─── Progress Ring (simple bar) ──────────────────────────────────────

interface ProgressBarProps {
  percentage: number;
  color: string;
  height?: number;
}

function ProgressBar({ percentage, color, height = 6 }: ProgressBarProps) {
  return (
    <View style={[progressStyles.barBackground, { height }]}>
      <View
        style={[
          progressStyles.barFill,
          {
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
}

const progressStyles = StyleSheet.create({
  barBackground: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    borderRadius: 3,
  },
});

// ─── Overall Progress Component ──────────────────────────────────────

interface OverallProgressProps {
  packed: number;
  total: number;
  percentage: number;
}

function OverallProgress({ packed, total, percentage }: OverallProgressProps) {
  const isComplete = percentage === 100;

  return (
    <View style={[overallStyles.container, Shadows.card]}>
      <View style={overallStyles.headerRow}>
        <View style={overallStyles.headerLeft}>
          <Ionicons
            name={isComplete ? 'checkmark-circle' : 'cube-outline'}
            size={24}
            color={isComplete ? Colors.success : Colors.primary}
            style={overallStyles.icon}
          />
          <View>
            <Text style={overallStyles.title}>
              {isComplete ? '¡Todo listo!' : 'Preparando equipaje'}
            </Text>
            <Text style={overallStyles.subtitle}>
              {packed} de {total} ítems empacados
            </Text>
          </View>
        </View>
        <View style={overallStyles.percentageContainer}>
          <Text
            style={[
              overallStyles.percentageText,
              { color: isComplete ? Colors.success : Colors.primary },
            ]}
          >
            {percentage}%
          </Text>
        </View>
      </View>

      <ProgressBar
        percentage={percentage}
        color={isComplete ? Colors.success : Colors.primary}
        height={8}
      />

      {isComplete && (
        <View style={overallStyles.completeMessage}>
          <Ionicons
            name="sparkles"
            size={14}
            color={Colors.success}
            style={overallStyles.completeIcon}
          />
          <Text style={overallStyles.completeText}>
            ¡Tu maleta está lista para el viaje!
          </Text>
        </View>
      )}
    </View>
  );
}

const overallStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  percentageContainer: {
    marginLeft: Spacing.md,
  },
  percentageText: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
  },
  completeMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.successMuted,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  completeIcon: {
    marginRight: Spacing.sm,
  },
  completeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.success,
  },
});

// ─── Category Section Component ──────────────────────────────────────

interface CategorySectionProps {
  category: ChecklistCategory;
  items: ChecklistItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

function CategorySection({
  category,
  items,
  isExpanded,
  onToggleExpand,
  onToggleItem,
  onDeleteItem,
}: CategorySectionProps) {
  const categoryLabel = CHECKLIST_CATEGORIES[category];
  const categoryColor = CHECKLIST_COLORS[category];
  const categoryIcon = getCategoryIcon(category);
  const { packed, total } = getCategoryProgress(items);
  const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
  const isComplete = packed === total && total > 0;

  return (
    <View style={[catStyles.container, Shadows.sm]}>
      {/* Category header (collapsible) */}
      <TouchableOpacity
        style={catStyles.header}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={catStyles.headerLeft}>
          <View
            style={[
              catStyles.iconContainer,
              { backgroundColor: `${categoryColor}14` },
            ]}
          >
            <Ionicons name={categoryIcon} size={18} color={categoryColor} />
          </View>
          <View style={catStyles.headerTextContainer}>
            <Text style={catStyles.categoryName}>{categoryLabel}</Text>
            <View style={catStyles.progressRow}>
              <View style={catStyles.progressBarContainer}>
                <ProgressBar percentage={percentage} color={categoryColor} height={4} />
              </View>
              <Text
                style={[
                  catStyles.progressText,
                  isComplete && { color: Colors.success },
                ]}
              >
                {packed}/{total}
              </Text>
            </View>
          </View>
        </View>

        <View style={catStyles.headerRight}>
          {isComplete && (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={Colors.success}
              style={catStyles.completeIcon}
            />
          )}
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={Layout.iconSizeMedium}
            color={Colors.textTertiary}
          />
        </View>
      </TouchableOpacity>

      {/* Items list (collapsible) */}
      {isExpanded && (
        <View style={catStyles.itemsList}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <View
                key={item.id}
                style={[catStyles.itemRow, !isLast && catStyles.itemRowBorder]}
              >
                <TouchableOpacity
                  style={catStyles.checkbox}
                  onPress={() => onToggleItem(item.id)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={item.isPacked ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={
                      item.isPacked ? categoryColor : Colors.textTertiary
                    }
                  />
                </TouchableOpacity>

                <View style={catStyles.itemContent}>
                  <Text
                    style={[
                      catStyles.itemName,
                      item.isPacked && catStyles.itemNamePacked,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.quantity > 1 && (
                    <View style={catStyles.quantityBadge}>
                      <Text style={catStyles.quantityText}>×{item.quantity}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={catStyles.deleteButton}
                  onPress={() => onDeleteItem(item.id)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="close"
                    size={16}
                    color={Colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const catStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBarContainer: {
    flex: 1,
    maxWidth: 120,
  },
  progressText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    minWidth: 30,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  completeIcon: {
    marginRight: Spacing.sm,
  },

  // ─── Items list ─────────────────────────────────
  itemsList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.base,
  },
  itemRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  checkbox: {
    marginRight: Spacing.md,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    flexShrink: 1,
  },
  itemNamePacked: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  quantityBadge: {
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 1,
  },
  quantityText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
});

// ─── Template Card Component ─────────────────────────────────────────

interface TemplateCardProps {
  type: TemplateType;
  onSelect: () => void;
}

function TemplateCard({ type, onSelect }: TemplateCardProps) {
  const name = TEMPLATE_NAMES[type];
  const icon = TEMPLATE_ICONS[type] as keyof typeof Ionicons.glyphMap;
  const itemCount = CHECKLIST_TEMPLATES[type].length;

  const TEMPLATE_COLORS: Record<TemplateType, string> = {
    beach: '#ED8936',
    mountain: '#48BB78',
    business: '#667EEA',
    generic: '#4299E1',
  };

  const color = TEMPLATE_COLORS[type];

  return (
    <TouchableOpacity
      style={[templateStyles.card, Shadows.sm]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View
        style={[templateStyles.iconCircle, { backgroundColor: `${color}14` }]}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={templateStyles.name}>{name}</Text>
      <Text style={templateStyles.itemCount}>{itemCount} ítems</Text>
      <Ionicons
        name="add-circle-outline"
        size={18}
        color={Colors.textTertiary}
        style={templateStyles.addIcon}
      />
    </TouchableOpacity>
  );
}

const templateStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  itemCount: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  addIcon: {
    marginTop: Spacing.xs,
  },
});

// ─── Quick Add Bar Component ─────────────────────────────────────────

interface QuickAddBarProps {
  onAdd: (name: string) => void;
}

function QuickAddBar({ onAdd }: QuickAddBarProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <View style={quickAddStyles.container}>
      <View style={quickAddStyles.inputRow}>
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={Colors.textTertiary}
          style={quickAddStyles.icon}
        />
        <TextInput
          style={quickAddStyles.input}
          placeholder="Añadir ítem rápido..."
          placeholderTextColor={Colors.textTertiary}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        {text.trim().length > 0 && (
          <TouchableOpacity
            style={quickAddStyles.addButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const quickAddStyles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: Layout.buttonHeightSmall + 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    paddingVertical: 0,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
});

// ─── Main Component ──────────────────────────────────────────────────

export default function ChecklistScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ChecklistCategory>
  >(new Set(CATEGORY_ORDER));
  const [showTemplates, setShowTemplates] = useState(false);

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      const loaded = await getTripById(id);
      setTrip(loaded);
    } catch (error) {
      console.warn('[Checklist] Error loading trip:', error);
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

  // ─── Toggle category expansion ──────────────────────────────────

  const toggleCategory = useCallback((category: ChecklistCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // ─── Toggle item packed state ───────────────────────────────────

  const toggleItem = useCallback(
    async (itemId: string) => {
      if (!trip || !id) return;
      const updatedChecklist = trip.checklist.map((item) =>
        item.id === itemId
          ? { ...item, isPacked: !item.isPacked, updatedAt: new Date().toISOString() }
          : item
      );
      const updatedTrip = { ...trip, checklist: updatedChecklist };
      setTrip(updatedTrip);
      try {
        await updateTrip(updatedTrip);
      } catch (error) {
        console.warn('[Checklist] Error toggling item:', error);
      }
    },
    [trip, id]
  );

  // ─── Delete item ────────────────────────────────────────────────

  const deleteItem = useCallback(
    async (itemId: string) => {
      if (!trip || !id) return;
      Alert.alert(
        'Eliminar ítem',
        '¿Seguro que quieres eliminar este ítem de la checklist?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              const updatedChecklist = trip.checklist.filter(
                (item) => item.id !== itemId
              );
              const updatedTrip = { ...trip, checklist: updatedChecklist };
              setTrip(updatedTrip);
              try {
                await updateTrip(updatedTrip);
              } catch (error) {
                console.warn('[Checklist] Error deleting item:', error);
              }
            },
          },
        ]
      );
    },
    [trip, id]
  );

  // ─── Quick add item ─────────────────────────────────────────────

  const quickAddItem = useCallback(
    async (name: string) => {
      if (!trip || !id) return;
      const newItem = createChecklistItem(id, {
        name,
        category: 'other',
        quantity: 1,
        isPacked: false,
      });
      const updatedChecklist = [...trip.checklist, newItem];
      const updatedTrip = { ...trip, checklist: updatedChecklist };
      setTrip(updatedTrip);
      try {
        await updateTrip(updatedTrip);
      } catch (error) {
        console.warn('[Checklist] Error adding item:', error);
      }
    },
    [trip, id]
  );

  // ─── Load template ──────────────────────────────────────────────

  const loadTemplate = useCallback(
    async (templateType: TemplateType) => {
      if (!trip || !id) return;
      const templateItems = CHECKLIST_TEMPLATES[templateType];
      const hasExistingItems = trip.checklist.length > 0;

      const applyTemplate = async (replace: boolean) => {
        const baseChecklist = replace ? [] : [...trip.checklist];
        const newItems = templateItems.map((templateItem) =>
          createChecklistItem(id, {
            name: templateItem.name,
            category: templateItem.category,
            quantity: templateItem.quantity,
            isPacked: false,
          })
        );
        const updatedChecklist = [...baseChecklist, ...newItems];
        const updatedTrip = { ...trip, checklist: updatedChecklist };
        setTrip(updatedTrip);
        setShowTemplates(false);
        // Expand all categories to show new items
        setExpandedCategories(new Set(CATEGORY_ORDER));
        try {
          await updateTrip(updatedTrip);
        } catch (error) {
          console.warn('[Checklist] Error applying template:', error);
        }
      };

      if (hasExistingItems) {
        Alert.alert(
          'Cargar plantilla',
          'Ya tienes ítems en la checklist. ¿Qué quieres hacer?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Añadir',
              onPress: () => applyTemplate(false),
            },
            {
              text: 'Reemplazar',
              style: 'destructive',
              onPress: () => applyTemplate(true),
            },
          ]
        );
      } else {
        await applyTemplate(false);
      }
    },
    [trip, id]
  );

  // ─── Reset checklist ────────────────────────────────────────────

  const resetChecklist = useCallback(async () => {
    if (!trip || !id) return;
    Alert.alert(
      'Resetear checklist',
      '¿Quieres desmarcar todos los ítems? No se eliminarán, solo volverán al estado "pendiente".',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          onPress: async () => {
            const updatedChecklist = trip.checklist.map((item) => ({
              ...item,
              isPacked: false,
              updatedAt: new Date().toISOString(),
            }));
            const updatedTrip = { ...trip, checklist: updatedChecklist };
            setTrip(updatedTrip);
            try {
              await updateTrip(updatedTrip);
            } catch (error) {
              console.warn('[Checklist] Error resetting checklist:', error);
            }
          },
        },
      ]
    );
  }, [trip, id]);

  // ─── Derived data ───────────────────────────────────────────────

  const checklist = trip?.checklist ?? [];
  const isEmpty = checklist.length === 0;
  const progress = getChecklistProgress(checklist);
  const itemsByCategory = getChecklistByCategory(checklist);

  // Filter categories that have items
  const activeCategories = CATEGORY_ORDER.filter(
    (cat) => itemsByCategory[cat].length > 0
  );

  // ─── Render ─────────────────────────────────────────────────────

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando checklist...</Text>
      </View>
    );
  }

  // ─── Empty state ────────────────────────────────────────────────

  if (isEmpty && !showTemplates) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.emptyScrollContent,
          { paddingBottom: insets.bottom + Spacing['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <EmptyState
          icon="checkbox-outline"
          title="Prepara tu maleta"
          description="Crea una checklist de equipaje para no olvidarte de nada en tu viaje."
        />

        {/* Template selector */}
        <View style={styles.templateSection}>
          <Text style={styles.templateSectionTitle}>
            Empieza con una plantilla
          </Text>
          <Text style={styles.templateSectionDescription}>
            Selecciona un tipo de viaje y te sugeriremos los ítems esenciales.
          </Text>

          <View style={styles.templateGrid}>
            {(['beach', 'mountain', 'business', 'generic'] as TemplateType[]).map(
              (type, index) => (
                <React.Fragment key={type}>
                  <View style={styles.templateGridItem}>
                    <TemplateCard
                      type={type}
                      onSelect={() => loadTemplate(type)}
                    />
                  </View>
                  {/* Add gap between columns, not after last in row */}
                </React.Fragment>
              )
            )}
          </View>
        </View>

        {/* Or start from scratch */}
        <View style={styles.scratchSection}>
          <View style={styles.scratchDivider}>
            <View style={styles.scratchDividerLine} />
            <Text style={styles.scratchDividerText}>o bien</Text>
            <View style={styles.scratchDividerLine} />
          </View>

          <TouchableOpacity
            style={styles.scratchButton}
            onPress={() => setShowTemplates(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={Colors.primary}
              style={styles.scratchButtonIcon}
            />
            <Text style={styles.scratchButtonText}>
              Crear lista desde cero
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tip */}
        <View style={styles.tipContainer}>
          <Ionicons
            name="bulb-outline"
            size={16}
            color={Colors.categoryNote}
            style={styles.tipIcon}
          />
          <Text style={styles.tipText}>
            Consejo: Puedes añadir ítems rápidamente con el campo de texto
            rápido una vez tengas tu primera lista.
          </Text>
        </View>
      </ScrollView>
    );
  }

  // ─── Show template picker overlay ───────────────────────────────

  if (showTemplates && isEmpty) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.emptyScrollContent,
          { paddingBottom: insets.bottom + Spacing['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick add */}
        <QuickAddBar onAdd={quickAddItem} />

        {/* Template selector (compact) */}
        <View style={styles.templateSection}>
          <View style={styles.templateHeaderRow}>
            <Text style={styles.templateSectionTitle}>
              O carga una plantilla
            </Text>
            <TouchableOpacity
              onPress={() => setShowTemplates(false)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle-outline"
                size={22}
                color={Colors.textTertiary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.templateGrid}>
            {(['beach', 'mountain', 'business', 'generic'] as TemplateType[]).map(
              (type) => (
                <View key={type} style={styles.templateGridItem}>
                  <TemplateCard
                    type={type}
                    onSelect={() => loadTemplate(type)}
                  />
                </View>
              )
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  // ─── Main checklist view ────────────────────────────────────────

  return (
    <View style={styles.screen}>
      {/* Action bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionBarLeft}>
          <Text style={styles.actionBarCount}>
            {checklist.length} ítem{checklist.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.actionBarRight}>
          <TouchableOpacity
            style={styles.actionBarButton}
            onPress={() => {
              // Collapse all or expand all
              if (expandedCategories.size === activeCategories.length) {
                setExpandedCategories(new Set());
              } else {
                setExpandedCategories(new Set(CATEGORY_ORDER));
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                expandedCategories.size === activeCategories.length
                  ? 'contract-outline'
                  : 'expand-outline'
              }
              size={16}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBarButton}
            onPress={resetChecklist}
            activeOpacity={0.7}
          >
            <Ionicons
              name="refresh-outline"
              size={16}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBarButton}
            onPress={() => setShowTemplates(!showTemplates)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="layers-outline"
              size={16}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

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
        {/* Overall progress */}
        <OverallProgress
          packed={progress.packed}
          total={progress.total}
          percentage={progress.percentage}
        />

        {/* Quick add bar */}
        <QuickAddBar onAdd={quickAddItem} />

        {/* Template picker (inline, toggleable) */}
        {showTemplates && (
          <View style={styles.inlineTemplateSection}>
            <View style={styles.templateHeaderRow}>
              <Text style={styles.inlineTemplateTitle}>Cargar plantilla</Text>
              <TouchableOpacity
                onPress={() => setShowTemplates(false)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.inlineTemplateScroll}
            >
              {(
                ['beach', 'mountain', 'business', 'generic'] as TemplateType[]
              ).map((type) => {
                const name = TEMPLATE_NAMES[type];
                const icon = TEMPLATE_ICONS[type] as keyof typeof Ionicons.glyphMap;
                const count = CHECKLIST_TEMPLATES[type].length;

                const TEMPLATE_CHIP_COLORS: Record<TemplateType, string> = {
                  beach: '#ED8936',
                  mountain: '#48BB78',
                  business: '#667EEA',
                  generic: '#4299E1',
                };
                const color = TEMPLATE_CHIP_COLORS[type];

                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.inlineTemplateChip, Shadows.sm]}
                    onPress={() => loadTemplate(type)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.inlineTemplateIconCircle,
                        { backgroundColor: `${color}14` },
                      ]}
                    >
                      <Ionicons name={icon} size={18} color={color} />
                    </View>
                    <View>
                      <Text style={styles.inlineTemplateName}>{name}</Text>
                      <Text style={styles.inlineTemplateCount}>
                        {count} ítems
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Category sections */}
        {activeCategories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={itemsByCategory[category]}
            isExpanded={expandedCategories.has(category)}
            onToggleExpand={() => toggleCategory(category)}
            onToggleItem={toggleItem}
            onDeleteItem={deleteItem}
          />
        ))}

        {/* Empty categories hint */}
        {activeCategories.length === 0 && (
          <View style={styles.noCategoriesHint}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={Colors.textTertiary}
              style={styles.noCategoriesIcon}
            />
            <Text style={styles.noCategoriesText}>
              Todos los ítems han sido eliminados. Añade nuevos ítems con el
              campo de arriba o carga una plantilla.
            </Text>
          </View>
        )}
      </ScrollView>
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

  // ─── Action bar ─────────────────────────────────
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  actionBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBarCount: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  actionBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionBarButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.secondaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── List content ───────────────────────────────
  listContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.base,
  },

  // ─── Empty state content ────────────────────────
  emptyScrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },

  // ─── Template section ───────────────────────────
  templateSection: {
    marginBottom: Spacing.xl,
  },
  templateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  templateSectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  templateSectionDescription: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.6,
    marginBottom: Spacing.lg,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  templateGridItem: {
    width: '47%',
  },

  // ─── Scratch section ────────────────────────────
  scratchSection: {
    marginBottom: Spacing.xl,
  },
  scratchDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  scratchDividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  scratchDividerText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.md,
  },
  scratchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1.5,
    borderColor: Colors.primaryMutedStrong,
    borderStyle: 'dashed',
  },
  scratchButtonIcon: {
    marginRight: Spacing.sm,
  },
  scratchButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },

  // ─── Tip ────────────────────────────────────────
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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

  // ─── Inline template section ────────────────────
  inlineTemplateSection: {
    marginBottom: Spacing.lg,
  },
  inlineTemplateTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  inlineTemplateScroll: {
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  inlineTemplateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  inlineTemplateIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineTemplateName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  inlineTemplateCount: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    marginTop: 1,
  },

  // ─── No categories hint ─────────────────────────
  noCategoriesHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginTop: Spacing.md,
  },
  noCategoriesIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  noCategoriesText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.6,
  },
});
