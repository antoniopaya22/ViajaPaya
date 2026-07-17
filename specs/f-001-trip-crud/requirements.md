# Requirements: f-001-trip-crud

## Alcance

CRUD de viajes contra la tabla `trips` de Supabase (`supabase/migrations/0001_init.sql` + `0002_trip_destinations_array.sql`), ya con RLS por `user_id`. Campos: `name` (obligatorio), `destinations` (lista de al menos un destino, ver addendum), `start_date`/`end_date` (obligatorios), `budget_total` (opcional). `cover_image` queda fuera de alcance (necesita selector de imágenes, se aborda junto al gestor de documentos en `f-007`).

## Addendum — destinos como lista

Feedback del usuario tras el primer pase: un viaje puede tener varios destinos (p. ej. un interrail por 3 ciudades), y mostrar un único string largo como título de la tarjeta se cortaba mal. Cambiado `destination text` → `destinations text[]` en la tabla (migración `0002`). `DestinationsField` permite añadir/quitar destinos como chips; `TripCard` muestra hasta 2 destinos y añade `+N` si hay más, en vez de truncar con puntos suspensivos a media palabra.

## Addendum 2 — feedback de segunda ronda

11. CUANDO el usuario escribe un destino y dirige el foco a otro campo (sin pulsar Intro) EL SISTEMA DEBERÁ añadirlo igualmente a la lista (`onBlur` confirma, no solo `onSubmitEditing` — bug: se perdían destinos escritos si no se pulsaba Intro explícitamente).
12. CUANDO el usuario ya eligió fecha de inicio EL SISTEMA DEBERÁ impedir elegir una fecha de fin anterior a esa (`minimumDate` en el selector nativo) y, si ya había una fecha de fin anterior, actualizarla automáticamente a la nueva fecha de inicio.
13. CUANDO el usuario crea o edita un viaje EL SISTEMA NO DEBERÁ pedir un presupuesto — el coste se calcula sumando gastos (`f-006`), no se fija de antemano.
14. CUANDO el usuario crea un viaje nuevo EL SISTEMA DEBERÁ guiarlo paso a paso (nombre → destinos → fechas) en vez de un formulario largo único. La edición de un viaje existente (`trip/[id]`) permanece como formulario único (no se repite el wizard al editar).

## EARS

1. CUANDO el usuario autenticado abre la pantalla de Viajes EL SISTEMA DEBERÁ listar sus viajes ordenados por `start_date` ascendente.
2. CUANDO el usuario rellena nombre, destino y fechas y confirma EL SISTEMA DEBERÁ crear el viaje en Supabase asociado a su `user_id` y volver a la lista mostrándolo.
3. CUANDO faltan nombre, destino o alguna fecha EL SISTEMA DEBERÁ impedir el envío y mostrar un error inline por campo.
4. CUANDO `end_date` es anterior a `start_date` EL SISTEMA DEBERÁ mostrar un error y no guardar.
5. CUANDO el usuario abre un viaje existente EL SISTEMA DEBERÁ mostrar sus datos y permitir editarlos.
6. CUANDO el usuario edita y guarda un viaje EL SISTEMA DEBERÁ actualizar la fila en Supabase y reflejar el cambio en la lista.
7. CUANDO el usuario borra un viaje EL SISTEMA DEBERÁ pedir confirmación y, si confirma, eliminar la fila (cascada ya definida en el esquema para bookings/expenses/documents/itinerary_items).
8. CUANDO la app se reinicia con sesión activa EL SISTEMA DEBERÁ volver a mostrar los viajes ya creados (persistencia real vía Supabase, no mock).
9. CUANDO falla la petición a Supabase (red, RLS, etc.) EL SISTEMA DEBERÁ mostrar un mensaje de error legible en vez de dejar la pantalla en blanco o colgada en loading.
