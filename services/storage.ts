/**
 * ViajaPayá — Storage Service
 *
 * Typed wrapper around AsyncStorage for persisting trips and app data.
 * All domain entities live inside their parent Trip object (aggregate root),
 * so we only need trip-level CRUD plus a few global keys.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '@/types/trip';

// ─── Storage keys ────────────────────────────────────────────────────

const KEYS = {
  TRIPS: '@viajapaya/trips',
  SETTINGS: '@viajapaya/settings',
  ONBOARDING_DONE: '@viajapaya/onboarding_done',
} as const;

// ─── Generic helpers ─────────────────────────────────────────────────

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[Storage] Error reading key "${key}":`, error);
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[Storage] Error writing key "${key}":`, error);
    throw error;
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Storage] Error removing key "${key}":`, error);
  }
}

// ─── Trip CRUD ───────────────────────────────────────────────────────

/**
 * Returns all persisted trips, sorted by startDate ascending.
 */
export async function getAllTrips(): Promise<Trip[]> {
  const trips = await getItem<Trip[]>(KEYS.TRIPS);
  if (!trips) return [];
  // Ensure chronological order
  return trips.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

/**
 * Retrieves a single trip by its id.
 */
export async function getTripById(tripId: string): Promise<Trip | null> {
  const trips = await getAllTrips();
  return trips.find((t) => t.id === tripId) ?? null;
}

/**
 * Persists a new trip. Throws if a trip with the same id already exists.
 */
export async function saveTrip(trip: Trip): Promise<void> {
  const trips = await getAllTrips();
  const existing = trips.findIndex((t) => t.id === trip.id);
  if (existing !== -1) {
    throw new Error(`[Storage] Trip with id "${trip.id}" already exists. Use updateTrip instead.`);
  }
  trips.push(trip);
  await setItem(KEYS.TRIPS, trips);
}

/**
 * Updates an existing trip in-place (full replace).
 */
export async function updateTrip(trip: Trip): Promise<void> {
  const trips = await getAllTrips();
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx === -1) {
    throw new Error(`[Storage] Trip "${trip.id}" not found.`);
  }
  trips[idx] = { ...trip, updatedAt: new Date().toISOString() };
  await setItem(KEYS.TRIPS, trips);
}

/**
 * Convenience: saves if new, updates if existing.
 */
export async function upsertTrip(trip: Trip): Promise<void> {
  const trips = await getAllTrips();
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx === -1) {
    trips.push(trip);
  } else {
    trips[idx] = { ...trip, updatedAt: new Date().toISOString() };
  }
  await setItem(KEYS.TRIPS, trips);
}

/**
 * Removes a trip and all its nested data.
 */
export async function deleteTrip(tripId: string): Promise<void> {
  const trips = await getAllTrips();
  const filtered = trips.filter((t) => t.id !== tripId);
  if (filtered.length === trips.length) {
    console.warn(`[Storage] deleteTrip: trip "${tripId}" was not found.`);
  }
  await setItem(KEYS.TRIPS, filtered);
}

/**
 * Replaces the entire trips array (use with care — handy for bulk import
 * or resetting demo data).
 */
export async function replaceAllTrips(trips: Trip[]): Promise<void> {
  await setItem(KEYS.TRIPS, trips);
}

// ─── Sub-entity helpers ──────────────────────────────────────────────
//
// These read the trip, mutate the relevant array, then persist the
// whole trip back. Keeps the API surface small and the storage layer
// as the single source of truth.

type TripArrayKey = {
  [K in keyof Trip]: Trip[K] extends Array<any> ? K : never;
}[keyof Trip];

/**
 * Generic "add item to a trip's sub-array" helper.
 */
export async function addSubEntity<K extends TripArrayKey>(
  tripId: string,
  key: K,
  item: Trip[K] extends Array<infer U> ? U : never
): Promise<Trip> {
  const trip = await getTripById(tripId);
  if (!trip) throw new Error(`[Storage] Trip "${tripId}" not found.`);
  (trip[key] as any[]).push(item);
  trip.updatedAt = new Date().toISOString();
  await updateTrip(trip);
  return trip;
}

/**
 * Generic "update item inside a trip's sub-array" helper.
 * The item must have an `id` field.
 */
export async function updateSubEntity<K extends TripArrayKey>(
  tripId: string,
  key: K,
  item: Trip[K] extends Array<infer U> ? U : never
): Promise<Trip> {
  const trip = await getTripById(tripId);
  if (!trip) throw new Error(`[Storage] Trip "${tripId}" not found.`);
  const arr = trip[key] as any[];
  const idx = arr.findIndex((e: any) => e.id === (item as any).id);
  if (idx === -1) throw new Error(`[Storage] Sub-entity not found in ${String(key)}.`);
  arr[idx] = item;
  trip.updatedAt = new Date().toISOString();
  await updateTrip(trip);
  return trip;
}

/**
 * Generic "remove item from a trip's sub-array" helper.
 */
export async function removeSubEntity<K extends TripArrayKey>(
  tripId: string,
  key: K,
  itemId: string
): Promise<Trip> {
  const trip = await getTripById(tripId);
  if (!trip) throw new Error(`[Storage] Trip "${tripId}" not found.`);
  (trip[key] as any[]) = (trip[key] as any[]).filter(
    (e: any) => e.id !== itemId
  );
  trip.updatedAt = new Date().toISOString();
  await updateTrip(trip);
  return trip;
}

// ─── Settings / flags ────────────────────────────────────────────────

export async function isOnboardingDone(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return value === 'true';
}

export async function markOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
}

/**
 * Wipes ALL app data. Useful during development.
 */
export async function clearAllData(): Promise<void> {
  const keys = Object.values(KEYS);
  await AsyncStorage.multiRemove(keys);
}

// ─── Export keys for testing ─────────────────────────────────────────

export { KEYS as STORAGE_KEYS };
