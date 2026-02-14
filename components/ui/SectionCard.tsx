import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
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

interface SectionCardProps {
  /** Ionicons icon name */
  icon: keyof typeof Ionicons.glyphMap;
  /** Accent color for icon background and decorations */
  color: string;
  /** Section title (e.g. "Transportes") */
  title: string;
  /** Subtitle or summary line (e.g. "2 vuelos, 1 tren") */
  subtitle?: string;
  /** Count badge value (e.g. number of items) */
  count?: number;
  /** Right-side accessory text (e.g. "450 €") */
  accessoryText?: string;
  /** Called when the card is pressed */
  onPress?: () => void;
  /** Whether the section has no items yet — shows a CTA style */
  isEmpty?: boolean;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Disable the card interaction */
  disabled?: boolean;
}

export default function SectionCard({
  icon,
  color,
  title,
  subtitle,
  count,
  accessoryText,
  onPress,
  isEmpty = false,
  style,
  disabled = false,
}: SectionCardProps) {
  const Wrapper = onPress && !disabled ? TouchableOpacity : View;
  const wrapperProps = onPress && !disabled
    ? { onPress, activeOpacity: 0.7 }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      style={[styles.container, Shadows.card, style]}
    >
      {/* Left icon circle */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}14` }]}>
        <Ionicons name={icon} size={Layout.iconSizeLarge} color={color} />
      </View>

      {/* Content area */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {count !== undefined && count > 0 && (
            <View style={[styles.countBadge, { backgroundColor: `${color}18` }]}>
              <Text style={[styles.countText, { color }]}>{count}</Text>
            </View>
          )}
        </View>

        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : isEmpty ? (
          <View style={styles.emptyRow}>
            <Ionicons
              name="add-circle-outline"
              size={14}
              color={Colors.primary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>Añadir</Text>
          </View>
        ) : null}
      </View>

      {/* Right accessory */}
      <View style={styles.rightSection}>
        {accessoryText ? (
          <Text style={styles.accessoryText} numberOfLines={1}>
            {accessoryText}
          </Text>
        ) : null}
        {onPress && !disabled ? (
          <Ionicons
            name="chevron-forward"
            size={Layout.iconSizeMedium}
            color={Colors.textTertiary}
            style={accessoryText ? styles.chevronWithText : undefined}
          />
        ) : null}
      </View>
    </Wrapper>
  );
}

/**
 * Compact variant for use inside grids (2-column layout).
 * Shows icon, title, and count in a smaller card.
 */
export function SectionCardCompact({
  icon,
  color,
  title,
  count,
  onPress,
  isEmpty = false,
  style,
  disabled = false,
}: Pick<
  SectionCardProps,
  'icon' | 'color' | 'title' | 'count' | 'onPress' | 'isEmpty' | 'style' | 'disabled'
>) {
  const Wrapper = onPress && !disabled ? TouchableOpacity : View;
  const wrapperProps = onPress && !disabled
    ? { onPress, activeOpacity: 0.7 }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      style={[styles.compactContainer, Shadows.sm, style]}
    >
      <View style={[styles.compactIconContainer, { backgroundColor: `${color}14` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <Text style={styles.compactTitle} numberOfLines={1}>
        {title}
      </Text>

      {count !== undefined && count > 0 ? (
        <Text style={[styles.compactCount, { color }]}>{count}</Text>
      ) : isEmpty ? (
        <Ionicons
          name="add-circle-outline"
          size={16}
          color={Colors.textTertiary}
        />
      ) : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  // ─── Full card ───────────────────────────────
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    flexShrink: 1,
  },
  countBadge: {
    marginLeft: Spacing.sm,
    minWidth: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs + 2,
  },
  countText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  emptyIcon: {
    marginRight: 4,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  accessoryText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    maxWidth: 90,
  },
  chevronWithText: {
    marginLeft: Spacing.xs,
  },

  // ─── Compact card ────────────────────────────
  compactContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  compactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  compactTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  compactCount: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
});
