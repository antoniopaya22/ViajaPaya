# Design: f-001-trip-crud

## Archivos

- `src/types/trip.ts` — tipo `Trip` reflejando la columna de Supabase.
- `src/services/trips.ts` — capa de acceso a datos, única que llama a `supabase.from('trips')`: `listTrips()`, `createTrip(input)`, `updateTrip(id, input)`, `deleteTrip(id)`. Todas asumen sesión activa (llamadas desde dentro de `AuthGate`, nunca antes).
- `src/hooks/useTrips.ts` — hook de estado: `{ trips, loading, error, refresh, create, update, remove }`, envuelve `src/services/trips.ts` para las pantallas.
- `src/components/ui/DateField.tsx` — campo de fecha (`Pressable` + `@react-native-community/datetimepicker` en modal), mismo lenguaje visual que `TextField`.
- `src/app/trip/new.tsx` — formulario de creación.
- `src/app/trip/[id].tsx` — ver/editar/borrar un viaje existente.
- `src/app/(tabs)/index.tsx` — sustituye `DEMO_TRIPS` por `useTrips()`.

## Modelo

```ts
interface Trip {
  id: string;
  userId: string;
  name: string;
  destinations: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string;
  budgetTotal: number | null;
  createdAt: string;
  updatedAt: string;
}
```

Supabase usa `snake_case` (`user_id`, `start_date`...); `src/services/trips.ts` mapea a/desde el `Trip` en `camelCase` para que el resto de la app no toque nombres de columna directamente.

## Estado de `TripStatus` (upcoming/ongoing/past)

`TripCard` ya acepta un `status` calculado (`upcoming | ongoing | past`); se deriva en el hook comparando `startDate`/`endDate` con la fecha actual (`Date.now()`), no se guarda en BBDD.

## Formulario

Un único componente de formulario (campos: nombre, destino, fecha inicio, fecha fin, presupuesto opcional) reutilizado por `new.tsx` (valores vacíos, botón "Crear") y `[id].tsx` (valores precargados, botones "Guardar"/"Eliminar"). Dado el tamaño (5 campos), se implementa inline en cada pantalla en vez de extraer un componente compartido todavía — si aparece una tercera pantalla con el mismo formulario, se extrae entonces.

## Borrado

`ListRow`/`Button` variant `destructive` + confirmación nativa (`Alert.alert`) antes de llamar a `deleteTrip`. No se implementa un modal de confirmación propio por ahora (`Alert.alert` cubre el caso con cero componentes nuevos).

## Fuera de alcance
`cover_image` (necesita `expo-image-picker`, se hace junto a `f-007`). Presupuesto vs. gastos reales (`f-006`). Reservas/itinerario dentro del detalle del viaje (`f-002` en adelante) — `[id].tsx` en esta pasada solo edita los campos propios del viaje.
