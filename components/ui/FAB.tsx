import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Layout, FontSizes, FontWeights } from "@/constants/theme";

interface FABProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
  backgroundColor?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function FAB({
  icon = "add",
  label,
  onPress,
  style,
  color = Colors.textInverse,
  backgroundColor = Colors.primary,
  size = "md",
  disabled = false,
}: FABProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const isExtended = !!label;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: disabled ? Colors.textTertiary : backgroundColor,
          width: isExtended ? undefined : sizeConfig.size,
          height: sizeConfig.size,
          borderRadius: isExtended ? BorderRadius.full : sizeConfig.size / 2,
          paddingHorizontal: isExtended ? Spacing.xl : 0,
        },
        styles.shadow,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Ionicons name={icon} size={sizeConfig.iconSize} color={color} />
      {label ? (
        <Text
          style={[
            styles.label,
            {
              color,
              fontSize: sizeConfig.fontSize,
              marginLeft: Spacing.sm,
            },
          ]}
        >
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const SIZE_CONFIG = {
  sm: {
    size: 46,
    iconSize: Layout.iconSizeMedium,
    fontSize: FontSizes.sm,
  },
  md: {
    size: 58,
    iconSize: Layout.iconSizeLarge,
    fontSize: FontSizes.md,
  },
  lg: {
    size: 66,
    iconSize: 28,
    fontSize: FontSizes.base,
  },
} as const;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 100,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  label: {
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.1,
  },
});
