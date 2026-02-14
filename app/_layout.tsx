import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the native splash screen immediately once fonts are loaded,
      // our custom LoadingScreen takes over the transition.
      SplashScreen.hideAsync();

      // Give a brief moment for the animated loading screen to display,
      // then trigger the fade-out transition.
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  // While fonts haven't loaded yet, render nothing (native splash still visible)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "slide_from_right",
        }}
      >
        {/* Main tab navigator */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />

        {/* Trip detail stack — pushed on top of tabs */}
        <Stack.Screen
          name="trip/[id]"
          options={{
            headerShown: false,
            animation: "slide_from_right",
            presentation: "card",
          }}
        />

        {/* Note create/edit form — modal slide from bottom */}
        <Stack.Screen
          name="note-form"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
            presentation: "modal",
          }}
        />

        {/* Document create/edit form — modal slide from bottom */}
        <Stack.Screen
          name="document-form"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
            presentation: "modal",
          }}
        />
      </Stack>

      {/* Animated loading screen overlay — fades out when ready */}
      {!isReady && <LoadingScreen />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
