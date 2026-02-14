import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Colors, BorderRadius, FontWeights } from "@/constants/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_HORIZONTAL_MARGIN = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH - TAB_BAR_HORIZONTAL_MARGIN * 2;
const TAB_BAR_HEIGHT = 64;

interface TabConfig {
  icon: string;
  iconOutline: string;
  label: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  index: {
    icon: "airplane",
    iconOutline: "airplane-outline",
    label: "Viajes",
  },
  documents: {
    icon: "wallet",
    iconOutline: "wallet-outline",
    label: "Cartera",
  },
  settings: {
    icon: "settings",
    iconOutline: "settings-outline",
    label: "Ajustes",
  },
};

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 220,
  mass: 0.8,
};

interface TabItemProps {
  route: { key: string; name: string };
  index: number;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  config: TabConfig;
  tabWidth: number;
}

function TabItem({ route, index, isFocused, onPress, onLongPress, config, tabWidth }: TabItemProps) {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(isFocused ? 1.05 : 1);

  useEffect(() => {
    iconScale.value = withSpring(isFocused ? 1.05 : 1, SPRING_CONFIG);
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  return (
    <TouchableOpacity
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={config.label}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.tabItem, { width: tabWidth }]}
    >
      <Animated.View style={[styles.tabItemInner, animatedContainerStyle]}>
        {/* Icon with pill background when active */}
        <Animated.View
          style={[styles.iconPill, isFocused ? styles.iconPillActive : styles.iconPillInactive, animatedIconStyle]}
        >
          <Ionicons
            name={(isFocused ? config.icon : config.iconOutline) as any}
            size={isFocused ? 20 : 22}
            color={isFocused ? "#FFFFFF" : Colors.textTertiary}
          />
        </Animated.View>

        {/* Label — always visible */}
        <Animated.Text
          style={[styles.tabLabel, isFocused ? styles.tabLabelActive : styles.tabLabelInactive]}
          numberOfLines={1}
        >
          {config.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabCount = state.routes.length;
  const tabWidth = TAB_BAR_WIDTH / tabCount;

  const bottomPadding = Platform.OS === "ios" ? Math.max(insets.bottom - 8, 8) : 12;

  return (
    <View style={[styles.outerContainer, { paddingBottom: bottomPadding }]}>
      <View style={styles.tabBarContainer}>
        {/* Background */}
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={90}
            tint="systemChromeMaterialLight"
            style={[StyleSheet.absoluteFill, styles.blurBackground]}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />
        )}

        {/* Tab items */}
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const config = TAB_CONFIG[route.name] || {
              icon: "ellipse",
              iconOutline: "ellipse-outline",
              label: route.name,
            };
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TabItem
                key={route.key}
                route={route}
                index={index}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                config={config}
                tabWidth={tabWidth}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: TAB_BAR_HORIZONTAL_MARGIN,
  },
  tabBarContainer: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  blurBackground: {
    borderRadius: BorderRadius["2xl"],
    backgroundColor: "rgba(255, 255, 255, 0.78)",
  },
  androidBackground: {
    borderRadius: BorderRadius["2xl"],
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: TAB_BAR_HEIGHT,
  },
  tabItemInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconPill: {
    width: 44,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: Colors.primary,
    // Subtle glow effect
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconPillInactive: {
    backgroundColor: "transparent",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.15,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  tabLabelInactive: {
    color: Colors.textTertiary,
  },
});
