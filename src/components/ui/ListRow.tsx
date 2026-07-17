import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';
import { Text } from './Text';

export interface ListRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

export function ListRow({ icon, title, subtitle, right, onPress, showChevron = !!onPress }: ListRowProps) {
  const { colors, spacing, radius } = useTheme();

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm }}>
      {icon ? (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={18} color={colors.textPrimary} />
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text variant="bodySmall" color="textSecondary">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right}

      {showChevron ? <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} /> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}
