import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button, DateField, DestinationsField, Header, Screen, TextField } from '@/components/ui';
import { useTrips } from '@/hooks/useTrips';
import { useTheme } from '@/theme';
import { toIsoDate } from '@/utils/trip';

export default function NewTripScreen() {
  const { spacing } = useTheme();
  const { create } = useTrips();

  const [name, setName] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'El nombre es obligatorio.';
    if (destinations.length === 0) nextErrors.destinations = 'Añade al menos un destino.';
    if (!startDate) nextErrors.startDate = 'Falta la fecha de inicio.';
    if (!endDate) nextErrors.endDate = 'Falta la fecha de fin.';
    if (startDate && endDate && endDate < startDate) {
      nextErrors.endDate = 'Debe ser posterior a la fecha de inicio.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await create({
        name: name.trim(),
        destinations,
        startDate: toIsoDate(startDate as Date),
        endDate: toIsoDate(endDate as Date),
        budgetTotal: budget.trim() ? Number(budget.trim()) : null,
      });
      router.back();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo crear el viaje.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <Header title="Nuevo viaje" showBack />

      <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
        <TextField label="Nombre" placeholder="Kioto 2026" value={name} onChangeText={setName} error={errors.name} />
        <DestinationsField
          label="Destinos"
          value={destinations}
          onChange={setDestinations}
          error={errors.destinations}
        />
        <DateField label="Fecha de inicio" value={startDate} onChange={setStartDate} error={errors.startDate} />
        <DateField label="Fecha de fin" value={endDate} onChange={setEndDate} error={errors.endDate} />
        <TextField
          label="Presupuesto (opcional)"
          placeholder="1500"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />
        <Button label="Crear viaje" onPress={handleSave} loading={submitting} fullWidth />
      </View>
    </Screen>
  );
}
