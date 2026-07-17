import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthProvider';
import { createTrip, deleteTrip, listTrips, updateTrip } from '@/services/trips';
import type { Trip, TripInput } from '@/types/trip';

export function useTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setTrips(await listTrips());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los viajes.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (input: TripInput) => {
    if (!user) throw new Error('No hay sesión activa.');
    const trip = await createTrip(user.id, input);
    setTrips((prev) => [...prev, trip].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    return trip;
  };

  const update = async (id: string, input: TripInput) => {
    const trip = await updateTrip(id, input);
    setTrips((prev) => prev.map((t) => (t.id === id ? trip : t)).sort((a, b) => a.startDate.localeCompare(b.startDate)));
    return trip;
  };

  const remove = async (id: string) => {
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return { trips, loading, error, refresh, create, update, remove };
}
