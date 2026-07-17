import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useTheme } from '@/theme';
import { Button } from './Button';
import { Text } from './Text';

export interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: radius.pill,
          backgroundColor: colors.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xs,
        }}
      >
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>

      <Text variant="h3" align="center">
        {title}
      </Text>

      {description ? (
        <Text variant="body" color="textSecondary" align="center" style={{ maxWidth: 280 }}>
          {description}
        </Text>
      ) : null}

      {actionLabel ? (
        <View style={{ marginTop: spacing.sm }}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
