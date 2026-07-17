# Requirements: f-010-supabase-setup

Notación EARS.

1. CUANDO la app arranca EL SISTEMA DEBERÁ inicializar el cliente de Supabase leyendo `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` de variables de entorno, sin ningún valor hardcodeado en el código fuente.
2. CUANDO se aplica la migración inicial EL SISTEMA DEBERÁ crear las tablas `trips`, `bookings`, `expenses`, `documents`, `itinerary_items` en Postgres, cada una con columna `user_id uuid not null`.
3. CUANDO se activa Row Level Security EL SISTEMA DEBERÁ exigir `user_id = auth.uid()` en select/insert/update/delete de cada tabla.
4. CUANDO un cliente anónimo (sin sesión) consulta cualquiera de las 5 tablas EL SISTEMA DEBERÁ devolver 0 filas (RLS deniega por defecto sin política que lo permita).
5. CUANDO se borra un `trip` EL SISTEMA DEBERÁ borrar en cascada sus `bookings`, `expenses`, `documents` (con `trip_id`) e `itinerary_items` asociados.
6. CUANDO se borra un `booking` referenciado por un `itinerary_item.linked_booking_id` EL SISTEMA DEBERÁ poner ese campo a `null` (no bloquear el borrado).

## Fuera de alcance
UI de login/registro (f-011-auth-sso). CRUD de aplicación sobre estas tablas (f-001 en adelante).
