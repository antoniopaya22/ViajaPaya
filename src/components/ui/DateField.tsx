import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

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

  const openPicker = () => {
    if (Platform.OS === 'android') {
      // La API declarativa (montar/desmontar <DateTimePicker>) es propensa en Android a
      // "Can't perform a React state update on a component that hasn't mounted yet" porque
      // el diálogo nativo puede llamar a onChange antes de que React termine de montarlo.
      // La librería recomienda la API imperativa para Android; evita el problema por completo.
      DateTimePickerAndroid.open({
        value: value ?? minimumDate ?? new Date(),
        mode: 'date',
        minimumDate,
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) onChange(selectedDate);
        },
      });
      return;
    }
    setShowPicker(true);
  };

  return (
    <View style={{ gap: spacing.xxs }}>
      <Text variant="subtitle">{label}</Text>

      <Pressable
        onPress={openPicker}
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

      {Platform.OS !== 'android' && showPicker && (
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
