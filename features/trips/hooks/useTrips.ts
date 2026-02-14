import { createNewTrip, getInitialTrips } from '@/services/tripService';
import { getImageFromCache, loadImageCache, searchDestinationImage } from '@/services/unsplashService';
import { Trip } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseTripsResult {
  trips: Trip[];
  selectedTrip: Trip | null;
  tripImages: Record<string, string>;
  isRefreshing: boolean;
  isCreateModalVisible: boolean;
  selectTrip: (trip: Trip | null) => void;
  addTrip: () => void;
  closeCreateModal: () => void;
  createTrip: (partial: Partial<Trip>) => Promise<void>;
  refresh: () => Promise<void>;
  deleteTrip: (tripId: string) => void;
  getTripImage: (tripId: string, destination: string) => string;
  updateTrip: (trip: Trip) => void;
}

export const useTrips = (): UseTripsResult => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripImages, setTripImages] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const initialize = useCallback(async () => {
    const initial = getInitialTrips();
    setTrips(initial);
    const cachedImages = await loadImageCache();
    setTripImages(cachedImages);
    const missing = initial.filter(t => !cachedImages[t.id]);
    if (missing.length) loadImages(missing);
  }, []);

  useEffect(() => { initialize(); }, [initialize]);

  const loadImages = useCallback(async (targets: Trip[]) => {
    const results = await Promise.all(targets.map(async trip => {
      try {
        const imageUrl = await searchDestinationImage(trip.id, trip.destination);
        return { id: trip.id, imageUrl };
      } catch {
        return { id: trip.id, imageUrl: 'https://source.unsplash.com/400x200/?travel' };
      }
    }));
    setTripImages(prev => ({ ...prev, ...Object.fromEntries(results.map(r => [r.id, r.imageUrl])) }));
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      await initialize();
      const current = getInitialTrips();
      if (current.length) loadImages(current.slice(0, Math.min(2, current.length)));
    } catch (e) {
      Alert.alert('Error', 'No se pudieron recargar los viajes.');
    } finally {
      setIsRefreshing(false);
    }
  }, [initialize, loadImages]);

  const createTrip = useCallback(async (data: Partial<Trip>) => {
    try {
      const newTrip = createNewTrip(data.name!, data.destination!);
      if (data.startDate) newTrip.startDate = data.startDate;
      if (data.endDate) newTrip.endDate = data.endDate;
      setTrips(prev => [...prev, newTrip]);
      searchDestinationImage(newTrip.id, newTrip.destination)
        .then(url => setTripImages(prev => ({ ...prev, [newTrip.id]: url })))
        .catch(() => {});
      Alert.alert('¡Viaje Creado!', `Tu viaje "${newTrip.name}" a ${newTrip.destination} ha sido creado.`, [
        { text: 'Ver Viaje', onPress: () => setSelectedTrip(newTrip) },
        { text: 'OK', style: 'cancel' }
      ]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el viaje.');
    }
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    const tripName = trip?.name || 'este viaje';
    Alert.alert('🗑️ Eliminar Viaje', `¿Eliminar "${tripName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        setTrips(prev => prev.filter(t => t.id !== tripId));
        setTripImages(prev => { const c = { ...prev }; delete c[tripId]; return c; });
        Alert.alert('✅ Viaje eliminado', `"${tripName}" se eliminó correctamente.`);
      } }
    ]);
  }, [trips]);

  const getTripImage = useCallback((tripId: string, destination: string) => {
    const cached = getImageFromCache(tripId);
    return cached || tripImages[tripId] || 'https://source.unsplash.com/400x200/?travel,destination';
  }, [tripImages]);

  const updateTrip = useCallback((updated: Trip) => {
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTrip(updated);
  }, []);

  return {
    trips,
    selectedTrip,
    tripImages,
    isRefreshing,
    isCreateModalVisible,
    selectTrip: setSelectedTrip,
    addTrip: () => setIsCreateModalVisible(true),
    closeCreateModal: () => setIsCreateModalVisible(false),
    createTrip,
    refresh,
    deleteTrip,
    getTripImage,
    updateTrip,
  };
};
