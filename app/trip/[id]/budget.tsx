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
  Expense,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  EXPENSE_ICONS,
  EXPENSE_COLORS,
  getCurrencySymbol,
  formatAmount,
  getTotalExpenses,
  getExpensesByCategory,
  getBudgetPercentage,
  getBudgetStatus,
  BUDGET_STATUS_COLORS,
  getDailyAverageExpense,
} from '@/types/expense';
import { getTripById } from '@/services/storage';
import EmptyState from '@/components/ui/EmptyState';
import FAB from '@/components/ui/FAB';

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

// ─── Budget Overview Component ───────────────────────────────────────

interface BudgetOverviewProps {
  totalExpenses: number;
  budget: number | undefined;
  currency: string;
  dailyAverage: number;
  expenseCount: number;
}

function BudgetOverview({
  totalExpenses,
  budget,
  currency,
  dailyAverage,
  expenseCount,
}: BudgetOverviewProps) {
  const symbol = getCurrencySymbol(currency);
  const hasBudget = budget !== undefined && budget > 0;
  const percentage = hasBudget ? getBudgetPercentage(totalExpenses, budget) : null;
  const status = getBudgetStatus(percentage);
  const barColor = BUDGET_STATUS_COLORS[status];
  const clampedPercentage = Math.min(percentage ?? 0, 100);

  const remaining = hasBudget ? budget! - totalExpenses : null;

  return (
    <View style={[overviewStyles.container, Shadows.card]}>
      {/* Total spent */}
      <View style={overviewStyles.totalRow}>
        <View>
          <Text style={overviewStyles.totalLabel}>Total gastado</Text>
          <Text style={overviewStyles.totalAmount}>
            {symbol}{totalExpenses.toFixed(2)}
          </Text>
        </View>
        {hasBudget && (
          <View style={overviewStyles.budgetInfo}>
            <Text style={overviewStyles.budgetLabel}>Presupuesto</Text>
            <Text style={overviewStyles.budgetAmount}>
              {symbol}{budget!.toFixed(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      {hasBudget && (
        <View style={overviewStyles.progressSection}>
          <View style={overviewStyles.barBackground}>
            <View
              style={[
                overviewStyles.barFill,
                {
                  width: `${clampedPercentage}%`,
                  backgroundColor: barColor,
                },
              ]}
            />
          </View>
          <View style={overviewStyles.progressMeta}>
            <Text style={[overviewStyles.percentageText, { color: barColor }]}>
              {percentage}% utilizado
            </Text>
            {remaining !== null && (
              <Text
                style={[
                  overviewStyles.remainingText,
                  remaining < 0 && { color: Colors.error },
                ]}
              >
                {remaining >= 0
                  ? `${symbol}${remaining.toFixed(0)} disponible`
                  : `${symbol}${Math.abs(remaining).toFixed(0)} excedido`}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Stats row */}
      <View style={overviewStyles.statsRow}>
        <View style={overviewStyles.statItem}>
          <Ionicons
            name="receipt-outline"
            size={16}
            color={Colors.textSecondary}
            style={overviewStyles.statIcon}
          />
          <View>
            <Text style={overviewStyles.statValue}>{expenseCount}</Text>
            <Text style={overviewStyles.statLabel}>
              gasto{expenseCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={overviewStyles.statDivider} />

        <View style={overviewStyles.statItem}>
          <Ionicons
            name="trending-up-outline"
            size={16}
            color={Colors.textSecondary}
            style={overviewStyles.statIcon}
          />
          <View>
            <Text style={overviewStyles.statValue}>
              {symbol}{dailyAverage.toFixed(0)}
            </Text>
            <Text style={overviewStyles.statLabel}>media/día</Text>
          </View>
        </View>
      </View>

      {/* Set budget CTA (if no budget) */}
      {!hasBudget && (
        <TouchableOpacity style={overviewStyles.setBudgetButton} activeOpacity={0.7}>
          <Ionicons
            name="wallet-outline"
            size={16}
            color={Colors.primary}
            style={overviewStyles.setBudgetIcon}
          />
          <Text style={overviewStyles.setBudgetText}>
            Establecer presupuesto
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const overviewStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  totalLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  budgetInfo: {
    alignItems: 'flex-end',
  },
  budgetLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  budgetAmount: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },

  // Progress
  progressSection: {
    marginBottom: Spacing.base,
  },
  barBackground: {
    height: 10,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  remainingText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: Spacing.sm,
  },
  statValue: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.base,
  },

  // Set budget CTA
  setBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.primaryMutedStrong,
    borderStyle: 'dashed',
  },
  setBudgetIcon: {
    marginRight: Spacing.sm,
  },
  setBudgetText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
});

// ─── Category Breakdown Component ────────────────────────────────────

interface CategoryBreakdownProps {
  expensesByCategory: Record<ExpenseCategory, number>;
  total: number;
  currency: string;
}

function CategoryBreakdown({
  expensesByCategory,
  total,
  currency,
}: CategoryBreakdownProps) {
  const symbol = getCurrencySymbol(currency);

  // Sort categories by amount descending, filter out zero amounts
  const sortedCategories = (
    Object.entries(expensesByCategory) as [ExpenseCategory, number][]
  )
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  if (sortedCategories.length === 0) return null;

  return (
    <View style={[breakdownStyles.container, Shadows.sm]}>
      <Text style={breakdownStyles.title}>Desglose por categoría</Text>

      {sortedCategories.map(([category, amount]) => {
        const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;
        const color = EXPENSE_COLORS[category];
        const icon = EXPENSE_ICONS[category] as keyof typeof Ionicons.glyphMap;
        const label = EXPENSE_CATEGORIES[category];

        return (
          <View key={category} style={breakdownStyles.row}>
            {/* Icon + label */}
            <View style={breakdownStyles.rowLeft}>
              <View
                style={[
                  breakdownStyles.iconCircle,
                  { backgroundColor: `${color}14` },
                ]}
              >
                <Ionicons name={icon} size={16} color={color} />
              </View>
              <Text style={breakdownStyles.categoryLabel}>{label}</Text>
            </View>

            {/* Bar + amount */}
            <View style={breakdownStyles.rowRight}>
              <View style={breakdownStyles.barContainer}>
                <View
                  style={[
                    breakdownStyles.barFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <View style={breakdownStyles.amountContainer}>
                <Text style={breakdownStyles.amountText}>
                  {symbol}{amount.toFixed(0)}
                </Text>
                <Text style={breakdownStyles.percentText}>{percentage}%</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const breakdownStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 130,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  categoryLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    flexShrink: 1,
  },
  rowRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    minWidth: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  amountText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  percentText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
});

// ─── Expense Card Component ──────────────────────────────────────────

interface ExpenseCardProps {
  expense: Expense;
  onPress: () => void;
}

function ExpenseCard({ expense, onPress }: ExpenseCardProps) {
  const categoryColor = EXPENSE_COLORS[expense.category];
  const categoryIcon = EXPENSE_ICONS[expense.category] as keyof typeof Ionicons.glyphMap;
  const categoryLabel = EXPENSE_CATEGORIES[expense.category];
  const symbol = getCurrencySymbol(expense.currency);
  const dateFormatted = formatDate(expense.date);

  return (
    <TouchableOpacity
      style={[expenseCardStyles.container, Shadows.sm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Category icon */}
      <View
        style={[
          expenseCardStyles.iconContainer,
          { backgroundColor: `${categoryColor}14` },
        ]}
      >
        <Ionicons name={categoryIcon} size={20} color={categoryColor} />
      </View>

      {/* Content */}
      <View style={expenseCardStyles.content}>
        <Text style={expenseCardStyles.concept} numberOfLines={1}>
          {expense.concept}
        </Text>
        <View style={expenseCardStyles.metaRow}>
          <View
            style={[
              expenseCardStyles.categoryBadge,
              { backgroundColor: `${categoryColor}14` },
            ]}
          >
            <Text style={[expenseCardStyles.categoryText, { color: categoryColor }]}>
              {categoryLabel}
            </Text>
          </View>
          <Text style={expenseCardStyles.dateText}>{dateFormatted}</Text>
        </View>
        {expense.notes ? (
          <Text style={expenseCardStyles.notes} numberOfLines={1}>
            {expense.notes}
          </Text>
        ) : null}
      </View>

      {/* Amount */}
      <View style={expenseCardStyles.amountSection}>
        <Text style={expenseCardStyles.amount}>
          {symbol}{expense.amount.toFixed(2)}
        </Text>
        {(expense.attachments?.length ?? 0) > 0 && (
          <View style={expenseCardStyles.attachBadge}>
            <Ionicons name="attach" size={12} color={Colors.textTertiary} />
            <Text style={expenseCardStyles.attachCount}>
              {expense.attachments!.length}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const expenseCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  concept: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing['2xs'],
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing['2xs'],
    borderRadius: BorderRadius.full,
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
  notes: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  amountSection: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  amount: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  attachBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  attachCount: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },
});

// ─── Filter chips for categories ─────────────────────────────────────

interface CategoryFilterChip {
  key: ExpenseCategory | 'all';
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const CATEGORY_FILTER_CHIPS: CategoryFilterChip[] = [
  { key: 'all', label: 'Todos' },
  { key: 'transport', label: 'Transporte', icon: 'airplane', color: EXPENSE_COLORS.transport },
  { key: 'accommodation', label: 'Alojamiento', icon: 'bed', color: EXPENSE_COLORS.accommodation },
  { key: 'food', label: 'Comida', icon: 'restaurant', color: EXPENSE_COLORS.food },
  { key: 'activities', label: 'Actividades', icon: 'ticket', color: EXPENSE_COLORS.activities },
  { key: 'shopping', label: 'Compras', icon: 'bag-handle', color: EXPENSE_COLORS.shopping },
  { key: 'health', label: 'Salud', icon: 'medkit', color: EXPENSE_COLORS.health },
  { key: 'communication', label: 'Comunicación', icon: 'phone-portrait', color: EXPENSE_COLORS.communication },
  { key: 'other', label: 'Otros', icon: 'pricetag', color: EXPENSE_COLORS.other },
];

// ─── Sort options ────────────────────────────────────────────────────

type SortMode = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'date_desc', label: 'Más recientes' },
  { key: 'date_asc', label: 'Más antiguos' },
  { key: 'amount_desc', label: 'Mayor importe' },
  { key: 'amount_asc', label: 'Menor importe' },
];

function sortExpenses(expenses: Expense[], mode: SortMode): Expense[] {
  const sorted = [...expenses];
  switch (mode) {
    case 'date_desc':
      return sorted.sort((a, b) => b.date.localeCompare(a.date));
    case 'date_asc':
      return sorted.sort((a, b) => a.date.localeCompare(b.date));
    case 'amount_desc':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'amount_asc':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}

// ─── Main Component ──────────────────────────────────────────────────

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ExpenseCategory | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('date_desc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const loadTrip = useCallback(async () => {
    if (!id) return;
    try {
      const loaded = await getTripById(id);
      setTrip(loaded);
    } catch (error) {
      console.warn('[Budget] Error loading trip:', error);
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

  const handleAddExpense = useCallback(() => {
    // TODO: Navigate to add expense screen
  }, []);

  const handleExpensePress = useCallback(
    (_expense: Expense) => {
      // TODO: Navigate to expense detail
    },
    []
  );

  // ─── Derived data ───────────────────────────────────────────────

  const allExpenses = trip?.expenses ?? [];
  const filteredExpenses =
    activeFilter === 'all'
      ? allExpenses
      : allExpenses.filter((e) => e.category === activeFilter);

  const sortedExpenses = sortExpenses(filteredExpenses, sortMode);

  const isEmpty = allExpenses.length === 0;
  const noResults = allExpenses.length > 0 && filteredExpenses.length === 0;

  const totalExpenses = getTotalExpenses(allExpenses);
  const expensesByCategory = getExpensesByCategory(allExpenses);
  const currency = trip?.budgetCurrency ?? 'EUR';
  const dailyAverage = trip ? getDailyAverageExpense(allExpenses, trip.startDate) : 0;

  // Counts by category for filter chips
  const countsByCategory: Partial<Record<ExpenseCategory, number>> = {};
  allExpenses.forEach((e) => {
    countsByCategory[e.category] = (countsByCategory[e.category] ?? 0) + 1;
  });

  const availableFilters = CATEGORY_FILTER_CHIPS.filter(
    (chip) =>
      chip.key === 'all' ||
      (countsByCategory[chip.key as ExpenseCategory] ?? 0) > 0
  );

  // ─── Render ─────────────────────────────────────────────────────

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando presupuesto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Content */}
      {isEmpty ? (
        <ScrollView
          contentContainerStyle={[
            styles.emptyScrollContent,
            { paddingBottom: insets.bottom + Spacing['3xl'] },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState
            icon="cash-outline"
            title="Sin gastos registrados"
            description="Empieza a registrar tus gastos para llevar un control del presupuesto del viaje."
            actionLabel="Registrar gasto"
            onAction={handleAddExpense}
          />

          {/* Budget setup card */}
          <View style={[styles.setupCard, Shadows.sm]}>
            <Ionicons
              name="wallet-outline"
              size={24}
              color={Colors.primary}
              style={styles.setupCardIcon}
            />
            <Text style={styles.setupCardTitle}>
              Establece un presupuesto
            </Text>
            <Text style={styles.setupCardDescription}>
              Define cuánto quieres gastar en el viaje para controlar tus finanzas.
            </Text>
            <TouchableOpacity
              style={styles.setupCardButton}
              activeOpacity={0.8}
            >
              <Text style={styles.setupCardButtonText}>
                Definir presupuesto
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category guide */}
          <View style={styles.categoryGuide}>
            <Text style={styles.categoryGuideTitle}>Categorías de gastos</Text>
            <View style={styles.categoryGuideGrid}>
              {CATEGORY_FILTER_CHIPS.filter((c) => c.key !== 'all').map((chip) => (
                <View key={chip.key} style={styles.categoryGuideItem}>
                  <View
                    style={[
                      styles.categoryGuideIcon,
                      { backgroundColor: `${chip.color}14` },
                    ]}
                  >
                    <Ionicons
                      name={chip.icon!}
                      size={16}
                      color={chip.color}
                    />
                  </View>
                  <Text style={styles.categoryGuideLabel}>{chip.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <>
          {/* Filter bar */}
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
                    ? allExpenses.length
                    : countsByCategory[chip.key as ExpenseCategory] ?? 0;

                return (
                  <TouchableOpacity
                    key={chip.key}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
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
            {/* Budget overview */}
            <BudgetOverview
              totalExpenses={totalExpenses}
              budget={trip.budget}
              currency={currency}
              dailyAverage={dailyAverage}
              expenseCount={allExpenses.length}
            />

            {/* Category breakdown */}
            {activeFilter === 'all' && (
              <CategoryBreakdown
                expensesByCategory={expensesByCategory}
                total={totalExpenses}
                currency={currency}
              />
            )}

            {/* Expenses list header */}
            <View style={styles.expensesHeader}>
              <Text style={styles.expensesHeaderTitle}>
                {activeFilter === 'all' ? 'Todos los gastos' : EXPENSE_CATEGORIES[activeFilter]}
              </Text>

              {/* Sort toggle */}
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setShowSortOptions(!showSortOptions)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="swap-vertical"
                  size={16}
                  color={Colors.textSecondary}
                  style={styles.sortButtonIcon}
                />
                <Text style={styles.sortButtonText}>
                  {SORT_OPTIONS.find((s) => s.key === sortMode)?.label ?? 'Ordenar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sort options dropdown */}
            {showSortOptions && (
              <View style={[styles.sortDropdown, Shadows.md]}>
                {SORT_OPTIONS.map((option) => {
                  const isActive = sortMode === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.sortOption,
                        isActive && styles.sortOptionActive,
                      ]}
                      onPress={() => {
                        setSortMode(option.key);
                        setShowSortOptions(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          isActive && styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isActive && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={Colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Expense list */}
            {noResults ? (
              <EmptyState
                icon="filter-outline"
                title="Sin resultados"
                description={`No hay gastos en la categoría "${
                  CATEGORY_FILTER_CHIPS.find((c) => c.key === activeFilter)
                    ?.label ?? activeFilter
                }".`}
                compact
              />
            ) : (
              sortedExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onPress={() => handleExpensePress(expense)}
                />
              ))
            )}
          </ScrollView>
        </>
      )}

      {/* FAB */}
      <FAB
        icon="add"
        onPress={handleAddExpense}
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

  // ─── Empty state ────────────────────────────────
  emptyScrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  setupCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  setupCardIcon: {
    marginBottom: Spacing.md,
  },
  setupCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  setupCardDescription: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSizes.sm * 1.6,
    marginBottom: Spacing.base,
    maxWidth: 260,
  },
  setupCardButton: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  setupCardButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  categoryGuide: {
    marginBottom: Spacing.xl,
  },
  categoryGuideTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  categoryGuideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  categoryGuideItem: {
    alignItems: 'center',
    width: 80,
  },
  categoryGuideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryGuideLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    paddingTop: Spacing.base,
  },

  // ─── Expenses header + sort ─────────────────────
  expensesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  expensesHeaderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.full,
  },
  sortButtonIcon: {
    marginRight: Spacing.xs,
  },
  sortButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  sortDropdown: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  sortOptionActive: {
    backgroundColor: Colors.primaryMuted,
  },
  sortOptionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  sortOptionTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
});
