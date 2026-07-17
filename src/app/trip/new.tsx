import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button, DateField, DestinationsField, Header, Screen, Text, TextField } from '@/components/ui';
import { useTrips } from '@/hooks/useTrips';
import { useTheme } from '@/theme';
import { toIsoDate } from '@/utils/trip';

const STEPS = ['name', 'destinations', 'dates'] as const;
type Step = (typeof STEPS)[number];

function StepProgress({ step }: { step: Step }) {
  const { colors, spacing, radius } = useTheme();
  const index = STEPS.indexOf(step);

  return (
    <View style={{ marginTop: spacing.xs }}>
      <Text variant="caption" color="textTertiary">
        Paso {index + 1} de {STEPS.length}
      </Text>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
        {STEPS.map((s, i) => (
          <View
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: radius.pill,
              backgroundColor: i <= index ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default function NewTripScreen() {
  const { spacing } = useTheme();
  const { create } = useTrips();

  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    if (endDate && endDate < date) setEndDate(date);
  };

  const goNext = () => {
    if (step === 'name') {
      if (!name.trim()) {
        setErrors({ name: 'El nombre es obligatorio.' });
        return;
      }
      setErrors({});
      setStep('destinations');
      return;
    }
    if (step === 'destinations') {
      if (destinations.length === 0) {
        setErrors({ destinations: 'Añade al menos un destino.' });
        return;
      }
      setErrors({});
      setStep('dates');
    }
  };

  const goBack = () => {
    if (step === 'destinations') setStep('name');
    else if (step === 'dates') setStep('destinations');
    else router.back();
  };

  const handleCreate = async () => {
    const nextErrors: Record<string, string> = {};
    if (!startDate) nextErrors.startDate = 'Falta la fecha de inicio.';
    if (!endDate) nextErrors.endDate = 'Falta la fecha de fin.';
    if (startDate && endDate && endDate < startDate) {
      nextErrors.endDate = 'Debe ser igual o posterior a la fecha de inicio.';
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
      <Header title="Nuevo viaje" showBack onBack={goBack} />
      <StepProgress step={step} />

      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        {step === 'name' && (
          <>
            <Text variant="h2">¿Cómo se llama tu viaje?</Text>
            <Text variant="body" color="textSecondary">
              Puedes ponerle el nombre que quieras, por ejemplo el destino o la ocasión.
            </Text>
            <TextField placeholder="Kioto 2026" value={name} onChangeText={setName} error={errors.name} />
            <Button label="Siguiente" onPress={goNext} fullWidth />
          </>
        )}

        {step === 'destinations' && (
          <>
            <Text variant="h2">¿Qué destinos visitarás?</Text>
            <Text variant="body" color="textSecondary">
              Añade uno o varios — puedes escribir ciudad y país juntos.
            </Text>
            <DestinationsField
              label="Destinos"
              value={destinations}
              onChange={setDestinations}
              error={errors.destinations}
            />
            <Button label="Siguiente" onPress={goNext} fullWidth />
          </>
        )}

        {step === 'dates' && (
          <>
            <Text variant="h2">¿Cuándo es el viaje?</Text>
            <DateField label="Fecha de inicio" value={startDate} onChange={handleStartDateChange} error={errors.startDate} />
            <DateField
              label="Fecha de fin"
              value={endDate}
              onChange={setEndDate}
              error={errors.endDate}
              minimumDate={startDate ?? undefined}
            />
            <Button label="Crear viaje" onPress={handleCreate} loading={submitting} fullWidth />
          </>
        )}
      </View>
    </Screen>
  );
}
