import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  FadeOut,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontWeights } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BAR_WIDTH = SCREEN_WIDTH * 0.5;

export default function LoadingScreen() {
  // ─── Shared values ──────────────────────────────────────────
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);
  const barProgress = useSharedValue(0);
  const dotOpacity1 = useSharedValue(0.3);
  const dotOpacity2 = useSharedValue(0.3);
  const dotOpacity3 = useSharedValue(0.3);
  const subtitleOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0.2);

  useEffect(() => {
    // ─── Logo entrance ────────────────────────────────────────
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    logoTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // ─── Icon pulsing ─────────────────────────────────────────
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // ─── Icon gentle rotation ─────────────────────────────────
    iconRotate.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // ─── Loading bar progress ─────────────────────────────────
    barProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.cubic) })
      ),
      -1,
      false
    );

    // ─── Loading dots cascade ─────────────────────────────────
    dotOpacity1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    dotOpacity2.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    dotOpacity3.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // ─── Subtitle fade in ─────────────────────────────────────
    subtitleOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // ─── Glow pulse ───────────────────────────────────────────
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // ─── Animated styles ────────────────────────────────────────

  const logoContainerStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const barFillStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      barProgress.value,
      [0, 1],
      [-BAR_WIDTH, BAR_WIDTH]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dotOpacity1.value,
  }));
  const dot2Style = useAnimatedStyle(() => ({
    opacity: dotOpacity2.value,
  }));
  const dot3Style = useAnimatedStyle(() => ({
    opacity: dotOpacity3.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View
      style={styles.container}
      exiting={FadeOut.duration(400).easing(Easing.out(Easing.cubic))}
    >
      {/* Background glow */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Main content */}
      <Animated.View style={[styles.content, logoContainerStyle]}>
        {/* Airplane icon */}
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <View style={styles.iconCircle}>
            <Ionicons name="airplane" size={36} color={Colors.textInverse} />
          </View>
        </Animated.View>

        {/* App name */}
        <Text style={styles.appName}>ViajaPayá</Text>

        {/* Loading dots */}
        <Animated.View style={[styles.subtitleRow, subtitleStyle]}>
          <Text style={styles.loadingText}>Preparando tu viaje</Text>
          <View style={styles.dotsRow}>
            <Animated.View style={[styles.dot, dot1Style]} />
            <Animated.View style={[styles.dot, dot2Style]} />
            <Animated.View style={[styles.dot, dot3Style]} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Loading bar */}
      <Animated.View style={[styles.barContainer, subtitleStyle]}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, barFillStyle]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primaryLight,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  appName: {
    fontSize: 34,
    fontWeight: FontWeights.extrabold,
    color: Colors.textInverse,
    letterSpacing: 1,
    marginBottom: 12,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: FontWeights.medium,
    color: "rgba(255, 255, 255, 0.85)",
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  barContainer: {
    position: "absolute",
    bottom: 100,
    width: BAR_WIDTH,
    alignItems: "center",
  },
  barTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  barFill: {
    width: "60%",
    height: "100%",
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
