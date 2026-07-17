import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme';
import { Text } from './Text';

export interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string | null;
  minimumDate?: Date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function DateField({ label, value, onChange, error, minimumDate }: DateFieldProps) {
  const { colors, radius, spacing } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ gap: spacing.xxs }}>
      <Text variant="subtitle">{label}</Text>

      <Pressable
        onPress={() => setShowPicker(true)}
        style={{
          height: 52,
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor: error ? colors.danger : colors.border,
          backgroundColor: colors.surface,
          paddingHorizontal: spacing.sm,
          justifyContent: 'center',
        }}
      >
        <Text variant="body" color={value ? 'textPrimary' : 'textTertiary'}>
          {value ? formatDate(value) : 'Selecciona una fecha'}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value ?? minimumDate ?? new Date()}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          onChange={(_event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}

      {error ? (
        <Text variant="bodySmall" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
