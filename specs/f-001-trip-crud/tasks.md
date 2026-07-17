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
