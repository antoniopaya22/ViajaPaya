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
  getTripStatus,
  getTripDurationDays,
  getDaysUntilTrip,
  getCurrentDayOfTrip,
} from '@/types/trip';
import { getTotalExpenses, getBudgetPercentage, getBudgetStatus, BUDGET_STATUS_COLORS, getCurrencySymbol } from '@/types/expense';
import { getChecklistProgress } from '@/types/checklist';
import { getTripById } from '@/services/storage';
import SectionCard from '@/components/ui/SectionCard';
import EmptyState from '@/components/ui/EmptyState';

// ─── Quick stat item ─────────────────────────────────────────────────

interface QuickStatProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  value: string | number;
}

function QuickStat({ icon, color, label, value }: QuickStatProps) {
  return (
    <View style={statStyles.container}>
      <View style={[statStyles.iconCircle, { backgroundColor: `${color}14` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing['2xs'],
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

// ─── Budget progress bar ─────────────────────────────────────────────

interface BudgetProgressProps {
  spent: number;
  budget: number;
  currency: string;
}

function BudgetProgress({ spent, budget, currency }: BudgetProgressProps) {
  const percentage = getBudgetPercentage(spent, budget);
  const status = getBudgetStatus(percentage);
  const barColor = BUDGET_STATUS_COLORS[status];
  const symbol = getCurrencySymbol(currency);
  const clampedPercentage = Math.min(percentage ?? 0, 100);

  return (
    <View style={budgetStyles.container}>
      <View style={budgetStyles.headerRow}>
        <Text style={budgetStyles.title}>Presupuesto</Text>
        <Text style={[budgetStyles.percentage, { color: barColor }]}>
          {percentage !== null ? `${percentage}%` : '–'}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={budgetStyles.barBackground}>
        <View
          style={[
            budgetStyles.barFill,
            {
              width: `${clampedPercentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      <View style={budgetStyles.amountsRow}>
        <Text style={budgetStyles.spentText}>
          {symbol}{spent.toFixed(0)} gastado
        </Text>
        <Text style={budgetStyles.budgetText}>
          {symbol}{budget.toFixed(0)} presupuesto
        </Text>
      </View>
    </View>
  );
}

const budgetStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    ...Shadows.card,
    marginBottom: Spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  percentage: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  barBackground: {
    height: 8,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spentText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  budgetText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textTertiary,
  },
});

// ─── Checklist progress mini ─────────────────────────────────────────

interface ChecklistMiniProps {
  packed: number;
  total: number;
  percentage: number;
}

function ChecklistMini({ packed, total, percentage }: ChecklistMiniProps) {
  return (
    <View style={checklistStyles.container}>
      <View style={checklistStyles.headerRow}>
        <Ionicons
          name="checkbox"
          size={18}
          color={Colors.categoryChecklist}
          style={checklistStyles.icon}
        />
        <Text style={checklistStyles.title}>Equipaje</Text>
        <Text style={checklistStyles.count}>
          {packed}/{total}
        </Text>
      </View>
      <View style={checklistStyles.barBackground}>
        <View
          style={[
            checklistStyles.barFill,
            { width: `${percentage}%` },
          ]}
        />
      </View>
      <Text style={checklistStyles.percentageText}>
        {percentage}% preparado
      </Text>
    </View>
  );
}

const checklistStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    ...Shadows.card,
    marginBottom: Spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  count: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.categoryChecklist,
  },
  barBackground: {
    height: 6,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.categoryChecklist,
  },
  percentageText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textTertiary,
  },
});

// ─── Main component ──────────────────────────────────────────────────

export default function TripSummaryScreen() {
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
      console.warn('[TripSummary] Error loading trip:', error);
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

  // ─── Navigation helpers ─────────────────────────────────────────

  const navigateTo = useCallback(
    (route: string) => {
      router.replace(`/trip/${id}${route}` as any);
    },
    [id, router]
  );

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // ─── Derived data ───────────────────────────────────────────────

  const status = getTripStatus(trip);
  const transportCount = trip.transports?.length ?? 0;
  const accommodationCount = trip.accommodations?.length ?? 0;
  const activityCount = trip.activities?.length ?? 0;
  const noteCount = trip.notes?.length ?? 0;

  const totalExpenses = getTotalExpenses(trip.expenses ?? []);
  const hasBudget = trip.budget !== undefined && trip.budget > 0;
  const budgetCurrency = trip.budgetCurrency ?? 'EUR';
  const currencySymbol = getCurrencySymbol(budgetCurrency);

  const checklistData = getChecklistProgress(trip.checklist ?? []);
  const hasChecklist = (trip.checklist?.length ?? 0) > 0;

  const totalElements = transportCount + accommodationCount + activityCount;

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
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
      {/* ─── Description (if exists) ─────────────────────────── */}
      {trip.description ? (
        <View style={styles.descriptionCard}>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color={Colors.textTertiary}
            style={styles.descriptionIcon}
          />
          <Text style={styles.descriptionText} numberOfLines={3}>
            {trip.description}
          </Text>
        </View>
      ) : null}

      {/* ─── Quick stats ─────────────────────────────────────── */}
      <View style={[styles.quickStatsCard, Shadows.card]}>
        <QuickStat
          icon="airplane"
          color={Colors.categoryTransport}
          label="Transportes"
          value={transportCount}
        />
        <View style={styles.statDivider} />
        <QuickStat
          icon="bed"
          color={Colors.categoryAccommodation}
          label="Alojamientos"
          value={accommodationCount}
        />
        <View style={styles.statDivider} />
        <QuickStat
          icon="ticket"
          color={Colors.categoryActivity}
          label="Actividades"
          value={activityCount}
        />
      </View>

      {/* ─── Budget progress ─────────────────────────────────── */}
      {hasBudget ? (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo('/budget')}>
          <BudgetProgress
            spent={totalExpenses}
            budget={trip.budget!}
            currency={budgetCurrency}
          />
        </TouchableOpacity>
      ) : totalExpenses > 0 ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigateTo('/budget')}
          style={[styles.budgetSimpleCard, Shadows.card]}
        >
          <View style={styles.budgetSimpleLeft}>
            <Ionicons
              name="cash"
              size={20}
              color={Colors.categoryExpense}
              style={styles.budgetSimpleIcon}
            />
            <View>
              <Text style={styles.budgetSimpleLabel}>Total gastado</Text>
              <Text style={styles.budgetSimpleAmount}>
                {currencySymbol}{totalExpenses.toFixed(2)}
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={Layout.iconSizeMedium}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
      ) : null}

      {/* ─── Checklist progress ───────────────────────────────── */}
      {hasChecklist && (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo('/checklist')}>
          <ChecklistMini
            packed={checklistData.packed}
            total={checklistData.total}
            percentage={checklistData.percentage}
          />
        </TouchableOpacity>
      )}

      {/* ─── Sections title ──────────────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>Secciones</Text>
        {totalElements > 0 && (
          <TouchableOpacity
            onPress={() => navigateTo('/timeline')}
            activeOpacity={0.7}
            style={styles.viewTimelineButton}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color={Colors.primary}
              style={styles.viewTimelineIcon}
            />
            <Text style={styles.viewTimelineText}>Ver timeline</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ─── Section cards ───────────────────────────────────── */}
      <SectionCard
        icon="airplane"
        color={Colors.categoryTransport}
        title="Transportes"
        subtitle={
          transportCount > 0
            ? `${transportCount} transporte${transportCount > 1 ? 's' : ''}`
            : undefined
        }
        count={transportCount}
        isEmpty={transportCount === 0}
        onPress={() => navigateTo('/transports')}
      />

      <SectionCard
        icon="bed"
        color={Colors.categoryAccommodation}
        title="Alojamientos"
        subtitle={
          accommodationCount > 0
            ? `${accommodationCount} alojamiento${accommodationCount > 1 ? 's' : ''}`
            : undefined
        }
        count={accommodationCount}
        isEmpty={accommodationCount === 0}
        onPress={() => navigateTo('/accommodations')}
      />

      <SectionCard
        icon="ticket"
        color={Colors.categoryActivity}
        title="Actividades"
        subtitle={
          activityCount > 0
            ? `${activityCount} actividad${activityCount > 1 ? 'es' : ''}`
            : undefined
        }
        count={activityCount}
        isEmpty={activityCount === 0}
        onPress={() => navigateTo('/activities')}
      />

      <SectionCard
        icon="cash"
        color={Colors.categoryExpense}
        title="Presupuesto y Gastos"
        subtitle={
          hasBudget
            ? `${currencySymbol}${totalExpenses.toFixed(0)} / ${currencySymbol}${trip.budget!.toFixed(0)}`
            : totalExpenses > 0
              ? `${currencySymbol}${totalExpenses.toFixed(0)} gastado`
              : undefined
        }
        count={(trip.expenses?.length ?? 0) > 0 ? trip.expenses!.length : undefined}
        isEmpty={(trip.expenses?.length ?? 0) === 0}
        onPress={() => navigateTo('/budget')}
      />

      <SectionCard
        icon="checkbox"
        color={Colors.categoryChecklist}
        title="Checklist de Equipaje"
        subtitle={
          hasChecklist
            ? `${checklistData.packed} de ${checklistData.total} listos`
            : undefined
        }
        count={hasChecklist ? checklistData.total : undefined}
        isEmpty={!hasChecklist}
        onPress={() => navigateTo('/checklist')}
      />

      <SectionCard
        icon="document-text"
        color={Colors.categoryNote}
        title="Notas"
        subtitle={
          noteCount > 0
            ? `${noteCount} nota${noteCount > 1 ? 's' : ''}`
            : undefined
        }
        count={noteCount}
        isEmpty={noteCount === 0}
        onPress={() => navigateTo('/notes')}
      />

      <SectionCard
        icon="folder-open"
        color={Colors.categoryDocument}
        title="Documentos del Viaje"
        subtitle="Billetes, reservas, QR"
        isEmpty
        onPress={() => navigateTo('/documents')}
      />

      {/* ─── Empty state message if no elements ──────────────── */}
      {totalElements === 0 && (
        <View style={styles.hintContainer}>
          <Ionicons
            name="sparkles-outline"
            size={20}
            color={Colors.accent}
            style={styles.hintIcon}
          />
          <Text style={styles.hintText}>
            Empieza añadiendo transportes, alojamientos o actividades para organizar tu viaje.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.base,
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

  // ─── Description ────────────────────────────────
  descriptionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    alignItems: 'flex-start',
  },
  descriptionIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  descriptionText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.md * 1.5,
  },

  // ─── Quick stats ────────────────────────────────
  quickStatsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.base,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },

  // ─── Budget simple ──────────────────────────────
  budgetSimpleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  budgetSimpleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetSimpleIcon: {
    marginRight: Spacing.md,
  },
  budgetSimpleLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  budgetSimpleAmount: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },

  // ─── Section header ─────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    letterSpacing: 0.2,
  },
  viewTimelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTimelineIcon: {
    marginRight: Spacing.xs,
  },
  viewTimelineText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },

  // ─── Hint ───────────────────────────────────────
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.accentMuted,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginTop: Spacing.md,
  },
  hintIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  hintText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: FontSizes.sm * 1.6,
  },
});
