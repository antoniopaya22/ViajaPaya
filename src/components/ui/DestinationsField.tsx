import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';
import { Text } from './Text';
import { TextField } from './TextField';

export interface DestinationsFieldProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  error?: string | null;
}

export function DestinationsField({ label, value, onChange, error }: DestinationsFieldProps) {
  const { colors, radius, spacing } = useTheme();
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const trimmed = draft.trim();
    setDraft('');
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  };

  const removeDestination = (destination: string) => {
    onChange(value.filter((d) => d !== destination));
  };

  return (
    <View style={{ gap: spacing.xxs }}>
      <TextField
        label={label}
        placeholder="Kioto, Japón"
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commitDraft}
        onBlur={commitDraft}
        returnKeyType="done"
        error={error}
      />

      {value.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xxs }}>
          {value.map((destination) => (
            <View
              key={destination}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: colors.primaryMuted,
                borderRadius: radius.pill,
                paddingVertical: 6,
                paddingLeft: spacing.sm,
                paddingRight: 6,
              }}
            >
              <Text variant="bodySmall" style={{ color: colors.primary }}>
                {destination}
              </Text>
              <Pressable onPress={() => removeDestination(destination)} hitSlop={6}>
                <Ionicons name="close-circle" size={16} color={colors.primary} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <Text variant="caption" color="textTertiary">
        Escribe un destino (p. ej. "Kioto, Japón") y pulsa Intro, o simplemente sigue adelante: se añade solo. Repite para
        añadir más de uno.
      </Text>
    </View>
  );
}
