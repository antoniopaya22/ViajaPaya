import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Layout } from "@/constants/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export default function EmptyState({
  icon = "compass-outline",
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Icon circle with gradient ring */}
      <View style={[styles.iconOuter, compact && styles.iconOuterCompact]}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.iconGradientRing, compact && styles.iconGradientRingCompact]}
        >
          <View style={[styles.iconCircle, compact && styles.iconCircleCompact]}>
            <Ionicons name={icon} size={compact ? 28 : 40} color={Colors.primary} />
          </View>
        </LinearGradient>
      </View>

      <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>

      {description ? (
        <Text style={[styles.description, compact && styles.descriptionCompact]}>{description}</Text>
      ) : null}

      {actionLabel && onAction ? (
        <TouchableOpacity
          style={[styles.actionButton, compact && styles.actionButtonCompact]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color={Colors.textInverse} style={styles.actionIcon} />
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing["4xl"],
  },
  containerCompact: {
    flex: 0,
    paddingVertical: Spacing["2xl"],
  },

  // ─── Icon ─────────────────────────────────────
  iconOuter: {
    marginBottom: Spacing.xl,
  },
  iconOuterCompact: {
    marginBottom: Spacing.base,
  },
  iconGradientRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 2.5,
  },
  iconGradientRingCompact: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 2,
  },
  iconCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleCompact: {
    borderRadius: 38,
  },

  // ─── Text ─────────────────────────────────────
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.sm,
    letterSpacing: -0.3,
  },
  titleCompact: {
    fontSize: FontSizes.lg,
  },
  description: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: FontSizes.md * 1.6,
    maxWidth: 280,
    marginBottom: Spacing.xl,
  },
  descriptionCompact: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.6,
    marginBottom: Spacing.base,
    maxWidth: 260,
  },

  // ─── Action button ────────────────────────────
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.full,
    minHeight: Layout.buttonHeightSmall,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonCompact: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
  },
  actionIcon: {
    marginRight: Spacing.sm,
  },
  actionLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
});
