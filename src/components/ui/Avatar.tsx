import { Image, View } from 'react-native';

import { useTheme } from '@/theme';
import { Text } from './Text';

export interface AvatarProps {
  name: string;
  imageUri?: string;
  size?: number;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

export function Avatar({ name, imageUri, size = 44 }: AvatarProps) {
  const { colors } = useTheme();

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primaryMuted,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text variant="title" style={{ color: colors.primary, fontSize: size * 0.4 }}>
        {initialsFrom(name)}
      </Text>
    </View>
  );
}
