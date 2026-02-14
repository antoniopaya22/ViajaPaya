import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/theme";
import CustomTabBar from "@/components/ui/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* ─── Tab 1: Mis Viajes (Home) ─────────────────────────── */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Viajes",
        }}
      />

      {/* ─── Tab 2: Mi Cartera (Personal Documents) ───────────── */}
      <Tabs.Screen
        name="documents"
        options={{
          title: "Cartera",
        }}
      />

      {/* ─── Tab 3: Ajustes (Settings) ────────────────────────── */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
        }}
      />
    </Tabs>
  );
}
