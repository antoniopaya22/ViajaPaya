# Tasks: f-001-trip-crud

- [x] `src/types/trip.ts`
- [x] `src/services/trips.ts` (list/create/update/delete, mapeo camelCase ↔ snake_case)
- [x] `src/hooks/useTrips.ts`
- [x] `src/components/ui/DateField.tsx` + `DateField.web.tsx` (instalado `@react-native-community/datetimepicker`; sin soporte web, variante `.web.tsx` con input de texto para el preview de escritorio)
- [x] `src/app/trip/new.tsx`
- [x] `src/app/trip/[id].tsx` (ver/editar/borrar)
- [x] `src/app/(tabs)/index.tsx`: `useTrips()` en vez de `DEMO_TRIPS`, botón "Nuevo" navega a `/trip/new`, `TripCard` navega a `/trip/[id]`, refresco al volver a la tab (`useFocusEffect`)
- [x] `npx tsc --noEmit` y `npm test` sin errores (incluye tests nuevos de `getTripStatus`)
- [ ] Verificar en dispositivo real: crear/editar/borrar un viaje de prueba (pendiente de confirmación del usuario — no automatizable sin sesión real en el navegador de este entorno)
- [ ] Marcar `f-001` `done` en `feature_list.json`, actualizar `progress/`

## Segunda ronda de feedback

- [x] `DestinationsField`: confirmar destino también en `onBlur`, no solo Intro (bug: se perdían destinos)
- [x] `DateField`: prop `minimumDate`; auto-ajustar fecha de fin si queda antes de la nueva fecha de inicio
- [x] Eliminar `budget_total` de `trips` (migración `0003`), de `Trip`/`TripInput`, del servicio y de ambos formularios
- [x] Reescribir `f-006` en `feature_list.json`: gastos progresivos con descripción/etiquetas, no presupuesto previo
- [x] `trip/new.tsx` como wizard de 3 pasos (nombre → destinos → fechas); `trip/[id].tsx` se mantiene como formulario único
- [x] Migraciones `0002`/`0003` aplicadas contra el proyecto Supabase real
- [x] `npx tsc --noEmit` y `npm test` sin errores
