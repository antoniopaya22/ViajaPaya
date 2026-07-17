import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { Button, DateField, DestinationsField, Header, Screen, Text, TextField } from '@/components/ui';
import { deleteTrip, getTrip, updateTrip } from '@/services/trips';
import { useTheme } from '@/theme';
import { parseIsoDate, toIsoDate } from '@/utils/trip';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getTrip(id).then((trip) => {
      if (!active) return;
      if (!trip) {
        setNotFound(true);
      } else {
        setName(trip.name);
        setDestinations(trip.destinations);
        setStartDate(parseIsoDate(trip.startDate));
        setEndDate(parseIsoDate(trip.endDate));
        setBudget(trip.budgetTotal != null ? String(trip.budgetTotal) : '');
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

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
      await updateTrip(id, {
        name: name.trim(),
        destinations,
        startDate: toIsoDate(startDate as Date),
        endDate: toIsoDate(endDate as Date),
        budgetTotal: budget.trim() ? Number(budget.trim()) : null,
      });
      router.back();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar el viaje.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar viaje', `¿Seguro que quieres eliminar "${name}"? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTrip(id);
            router.back();
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo eliminar el viaje.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (notFound) {
    return (
      <Screen>
        <Header title="Viaje no encontrado" showBack />
        <Text variant="body" color="textSecondary" style={{ marginTop: spacing.md }}>
          Puede que ya se haya eliminado.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title={name || 'Editar viaje'} showBack />

      <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
        <TextField label="Nombre" value={name} onChangeText={setName} error={errors.name} />
        <DestinationsField
          label="Destinos"
          value={destinations}
          onChange={setDestinations}
          error={errors.destinations}
        />
        <DateField label="Fecha de inicio" value={startDate} onChange={setStartDate} error={errors.startDate} />
        <DateField label="Fecha de fin" value={endDate} onChange={setEndDate} error={errors.endDate} />
        <TextField label="Presupuesto (opcional)" keyboardType="numeric" value={budget} onChangeText={setBudget} />
        <Button label="Guardar cambios" onPress={handleSave} loading={submitting} fullWidth />
        <Button label="Eliminar viaje" variant="destructive" onPress={handleDelete} fullWidth />
      </View>
    </Screen>
  );
}
