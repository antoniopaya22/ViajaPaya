import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  focused,
  color,
  outline,
  filled,
}: {
  focused: boolean;
  color: ColorValue;
  outline: IconName;
  filled: IconName;
}) {
  const { colors, radius } = useTheme();

  return (
    <View
      style={{
        width: 44,
        height: 30,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? colors.primaryMuted : 'transparent',
      }}
    >
      <Ionicons name={focused ? filled : outline} color={color} size={20} />
    </View>
  );
}

export default function TabsLayout() {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 56 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: {
          fontFamily: typography.caption.fontFamily,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} outline="airplane-outline" filled="airplane" />
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documentos',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} outline="document-text-outline" filled="document-text" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} outline="settings-outline" filled="settings" />
          ),
        }}
      />
    </Tabs>
  );
}
