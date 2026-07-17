import { View } from 'react-native';

import { useTheme } from '@/theme';
import { toIsoDate, parseIsoDate } from '@/utils/trip';
import { Text } from './Text';
import { TextField } from './TextField';

export interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string | null;
  minimumDate?: Date;
}

function safeParseIsoDate(value: string): Date | null {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseIsoDate(value) : null;
}

// @react-native-community/datetimepicker no tiene implementación web; en el
// preview de escritorio usamos un input de texto YYYY-MM-DD en su lugar
// (minimumDate no se aplica aquí, solo en el picker nativo).
export function DateField({ label, value, onChange, error, minimumDate: _minimumDate }: DateFieldProps) {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing.xxs }}>
      <TextField
        label={label}
        placeholder="AAAA-MM-DD"
        value={value ? toIsoDate(value) : ''}
        onChangeText={(text) => {
          const parsed = safeParseIsoDate(text);
          if (parsed) onChange(parsed);
        }}
        error={error}
      />
      <Text variant="caption" color="textTertiary">
        Formato AAAA-MM-DD (solo en la vista web de desarrollo)
      </Text>
    </View>
  );
}
