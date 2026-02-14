import React from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

// ─── Constants ───────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const WAVE_HEIGHT = 35;

// ─── Types ───────────────────────────────────────────────────────────

interface WaveHeaderProps {
  /** Content rendered inside the header (titles, buttons, stats, etc.) */
  children: React.ReactNode;
  /** Gradient start color — defaults to a warm light orange */
  gradientStart?: string;
  /** Gradient end color — defaults to the brand primary dark */
  gradientEnd?: string;
  /** Background color of the page the wave transitions into */
  waveTargetColor?: string;
  /** Height of the curved transition in px (default 35) */
  waveHeight?: number;
  /** Whether to render decorative background circles (default true) */
  showDecoration?: boolean;
  /** Extra bottom padding inside the header content area above the wave */
  extraBottomPadding?: number;
  /** Override safe-area top padding (if you handle it externally) */
  overridePaddingTop?: number;
}

// ─── Decorative circle config ────────────────────────────────────────

interface Circle {
  size: number;
  top: number;
  left: number; // percentage of container width
  opacity: number;
}

const DECORATIVE_CIRCLES: Circle[] = [
  { size: 140, top: -30, left: -8, opacity: 0.06 },
  { size: 90, top: 10, left: 72, opacity: 0.07 },
  { size: 60, top: 60, left: 55, opacity: 0.05 },
  { size: 180, top: -50, left: 80, opacity: 0.04 },
  { size: 45, top: 40, left: 15, opacity: 0.08 },
  { size: 30, top: 5, left: 42, opacity: 0.06 },
];

// ─── Component ───────────────────────────────────────────────────────

export default function WaveHeader({
  children,
  gradientStart = "#FF8F66",
  gradientEnd = "#E55A2B",
  waveTargetColor = Colors.background,
  waveHeight = WAVE_HEIGHT,
  showDecoration = true,
  extraBottomPadding = 0,
  overridePaddingTop,
}: WaveHeaderProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = overridePaddingTop ?? insets.top;

  return (
    <View style={styles.outerContainer}>
      {/* ─── Single gradient spanning header + wave area ──────── */}
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ─── Decorative circles ──────────────────────────────── */}
      {showDecoration && (
        <View style={styles.decorationLayer} pointerEvents="none">
          {DECORATIVE_CIRCLES.map((circle, index) => (
            <View
              key={index}
              style={[
                styles.decorativeCircle,
                {
                  width: circle.size,
                  height: circle.size,
                  borderRadius: circle.size / 2,
                  top: circle.top,
                  left: `${circle.left}%` as any,
                  opacity: circle.opacity,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* ─── Header content (children) ───────────────────────── */}
      <View
        style={[
          styles.contentArea,
          { paddingTop: paddingTop + 8 },
          extraBottomPadding > 0 && { paddingBottom: 16 + extraBottomPadding },
        ]}
      >
        {children}
      </View>

      {/* ─── Curved transition ───────────────────────────────── *
       *  A background-colored View with large asymmetric          *
       *  borderTopLeft/Right radii sits on top of the gradient.   *
       *  The gradient peeks through the rounded corners,           *
       *  creating a smooth concave wave effect.                    *
       * ──────────────────────────────────────────────────────── */}
      <View style={[styles.curveWrapper, { height: waveHeight }]}>
        <View
          style={[
            styles.curveShape,
            {
              backgroundColor: waveTargetColor,
              borderTopLeftRadius: waveHeight * 1.8,
              borderTopRightRadius: waveHeight * 0.6,
            },
          ]}
        />
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 10,
    position: "relative",
  },
  decorationLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  contentArea: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    position: "relative",
    zIndex: 2,
  },
  decorativeCircle: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    ...(Platform.OS === "ios"
      ? {
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
        }
      : {}),
  },
  curveWrapper: {
    position: "relative",
    zIndex: 3,
  },
  curveShape: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
