# Histórico (append-only)

Registro cronológico de sesiones/features completadas. No editar entradas pasadas, solo añadir al final.

## 2026-07-17 — Harness inicial

Creada la estructura completa del harness: `AGENTS.md`, `CLAUDE.md`, `docs/`, `feature_list.json` (sembrado con backlog inicial), `specs/`, `progress/`, subagentes (orchestrator/implementer/reviewer/explorer), comandos (`/feature:new`, `/feature:start`, `/feature:status`, `/progress:update`), skills locales (`viajapaya-domain`, `spec-workflow`), hooks de `.claude/settings.json`, y esqueleto vacío de `src/`. Ninguna feature de producto implementada todavía.

## 2026-07-17 — Supabase (Auth SSO + BBDD)

ADR 0002: Supabase como backend (Auth SSO + Postgres), manteniendo caché local para acceso offline (amplía ADR 0001). Añadidas `f-010-supabase-setup` y `f-011-auth-sso` al backlog. Credenciales (URL, publishable key, project ref, contraseña de BBDD) guardadas solo en `.env.local` (gitignored); `.env.example` documenta las variables sin valores.

## 2026-07-17 — f-000-project-bootstrap y f-012-design-system-layout (done)

Bootstrap real del proyecto Expo (SDK 57, Expo Router sobre `src/app`, TypeScript estricto con alias `@/*`, jest-expo + React Native Testing Library + babel-preset-expo). Construido el sistema de diseño (`src/theme`: colores claro/oscuro, tipografía Manrope/Inter vía Google Fonts, espaciado, radios, sombras, `ThemeProvider` con persistencia de preferencia en AsyncStorage) y la librería de componentes reutilizables (`src/components/ui`: Text, Button, Card, Screen, Header, IconButton, Badge, Divider, EmptyState, Avatar, ListRow) más `TripCard` de dominio. Layout base: root `_layout.tsx` (carga de fuentes, splash, Stack) y tabs Viajes/Documentos/Ajustes, cada una usando los mismos componentes. Verificado con `tsc --noEmit`, `npm test` (RNTL 14 requiere `await render(...)`, documentado en conventions.md) y `expo start --web` (bundling correcto, árbol de accesibilidad correcto en las 3 pantallas, sin errores de consola). Captura de pantalla no disponible en este entorno de preview (limitación de la herramienta, no de la app). Ambas features marcadas `done` en `feature_list.json`.

## 2026-07-17 — Ajustes de feedback: tab bar, tema claro, degradado

Probado en dispositivo físico (Pixel 7, Expo Go SDK 57 tras reinstalar el APK correcto tomado de expo.dev/go tras fallo de Play Store). Feedback del usuario: tab bar tapada por la barra de gestos de Android, diseño "genérico y aburrido", preferencia por tema claro. Corregido: `useSafeAreaInsets` en la tab bar, `ThemeProvider` por defecto en `light`, degradado teal-coral (leído como verde-a-rojo, colores casi complementarios) sustituido por un degradado tonal `gradientFrom`/`gradientTo` dentro de la familia teal, y rediseño con más personalidad (héroe de saludo, blobs decorativos, iconos de tab con pastilla activa, radios más redondeados).

## 2026-07-17 — f-010-supabase-setup (done)

Primera feature del backlog por prioridad. `supabase/migrations/0001_init.sql`: tablas `trips/bookings/expenses/documents/itinerary_items` con `user_id` y RLS (`user_id = auth.uid()`) en las cinco. Cliente único `src/services/supabase.ts` (`@supabase/supabase-js` + `react-native-url-polyfill`, AsyncStorage como storage de sesión), sin credenciales hardcodeadas. Migración aplicada contra el proyecto Supabase real vía conexión Postgres directa (script Node puntual con `pg`, no añadido a package.json). Verificado: 5 tablas creadas, RLS activo, políticas presentes, consulta REST anónima a `trips` devuelve `[]` (200 OK) confirmando que RLS deniega por defecto. Pendiente de verificar el lado "autenticado ve solo sus filas" del criterio de aceptación hasta que exista un usuario real en `f-011-auth-sso`. `tsc --noEmit` y `npm test` sin errores.

## 2026-07-17 — f-011-auth-sso (done, alcance ajustado a email OTP)

Segunda feature del backlog por prioridad. Decisión de alcance: Google/Apple SSO requieren que el usuario cree sus propias credenciales OAuth (Google Cloud Console / Apple Developer Program) — no son creables por un agente, así que se implementó email + código OTP (Supabase Auth nativo, cero configuración externa), dejando `AuthProvider` preparado para añadir proveedores sociales más adelante sin cambios de arquitectura. `feature_list.json` actualizado para reflejar el alcance real.

Construido: `src/contexts/AuthProvider.tsx` (session/user/loading, `sendOtp`/`verifyOtp`/`signOut`, suscrito a `onAuthStateChange`), `src/components/ui/TextField.tsx`, `src/app/login.tsx` (paso email → paso código), `AuthGate` en `src/app/_layout.tsx` (redirige a `/login` sin sesión y viceversa). `settings.tsx` y `index.tsx` ahora usan la sesión real (email, cerrar sesión, saludo dinámico vía `src/utils/user.ts#displayNameFromEmail`, con test).

Dos problemas de infraestructura encontrados y corregidos al integrar `@supabase/supabase-js` con Metro/Expo Router (documentados en `specs/f-011-auth-sso/tasks.md`):
1. `@supabase/functions-js` no resolvía bajo la resolución estricta de `exports` que Metro activa por defecto → `metro.config.js` con `resolver.unstable_enablePackageExports = false`.
2. `app.json` tenía `web.output: "static"`, que pre-renderiza los layouts en Node/SSR donde `window` no existe; el storage de sesión de Supabase lo necesita → cambiado a `web.output: "single"` (SPA, sin SSR), correcto para una app mobile-first.

Verificado: `tsc --noEmit`, `npm test` (incluye test nuevo de `displayNameFromEmail`), `expo start --web` sin errores de consola, sin sesión redirige a `/login` (confirmado por árbol de accesibilidad). Pendiente de que el usuario confirme en el Pixel 7 que el código OTP llega por email y el login completo funciona en dispositivo real.

## 2026-07-17 — f-013-google-sso (código listo, pendiente de configuración externa)

El usuario recibió el email de OTP como link (comportamiento por defecto de la plantilla de Supabase, no bug) y pidió login con Google además del email. Añadido `f-013-google-sso` al backlog, `status: in-progress` (no `done`: falta que el usuario complete la configuración externa y confirme el flujo end-to-end).

Código: `flowType: 'pkce'` en `src/services/supabase.ts`; `signInWithGoogle` en `AuthProvider` (`signInWithOAuth` + `expo-web-browser` `openAuthSessionAsync` + `exchangeCodeForSession`, sin depender del sistema de deep-link del SO); botón "Continuar con Google" en `login.tsx` junto al flujo de email (que sigue intacto). Instaladas `expo-web-browser` y `expo-auth-session`.

Pasos externos entregados al usuario (no automatizables, requieren su propia cuenta): crear proyecto + OAuth consent screen + OAuth client (tipo Web, redirect URI `https://eltpqbxcfoouwweqockh.supabase.co/auth/v1/callback`) en Google Cloud Console; pegar Client ID/Secret en Supabase Dashboard → Authentication → Providers → Google; añadir `viajapaya://*` a Authentication → URL Configuration → Redirect URLs.

Limitación documentada en `design.md`: en Expo Go la URI de redirect es dinámica (`exp://` + IP local), puede hacer falta añadirla puntualmente en Supabase; un dev client (`npx expo run:android`) usaría el scheme fijo `viajapaya://` sin ese problema. `tsc --noEmit` y `npm test` sin errores; verificado en `expo start --web` que el botón aparece y el flujo de email no se rompió.

**Confirmado funcionando en el Pixel 7**: login con Google completo end-to-end. Consola mostró `WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256` — esperado, Hermes no expone `crypto.subtle`; PKCE cae a método `plain` (válido según RFC 7636, no rompe nada). Investigado `expo-standard-web-crypto` como posible fix: solo implementa `getRandomValues`, no `subtle.digest`, así que no habría arreglado el warning — no se instaló. Usuario decidió dejarlo así en vez de invertir en un polyfill a medida. `f-013-google-sso` marcada `done`.

## 2026-07-17 — f-001-trip-crud, segunda ronda de feedback

Probado en el Pixel 7 tras la primera pasada. Tres problemas reportados:

1. **Bug real**: al escribir varios destinos y no pulsar Intro en el último, no se guardaba ninguno. `DestinationsField` solo confirmaba el borrador (`draft`) en `onSubmitEditing`; si el usuario tocaba otro campo o el botón de guardar sin pulsar Intro, el texto se perdía silenciosamente y la validación "añade al menos un destino" fallaba sin que quedara claro por qué. Corregido: `commitDraft` también se dispara en `onBlur` (evento nativo separado y anterior a que se procese la pulsación de otro botón, así que es fiable sin necesitar una ref imperativa).
2. **Restricción de fechas**: la fecha de fin ahora usa `minimumDate` (nueva prop de `DateField`, pasada al `DateTimePicker` nativo) igual a la fecha de inicio elegida; si ya había una fecha de fin anterior a la nueva fecha de inicio, se ajusta automáticamente.
3. **Malentendido de presupuesto**: la app pedía un presupuesto al crear el viaje; el usuario quiere ir registrando gastos (con descripción y etiquetas) y calcular el coste total a posteriori, no fijar un presupuesto de antemano. Eliminado `budget_total` de `trips` (migración `0003`, aplicada al proyecto real), de `Trip`/`TripInput`, del servicio y de ambos formularios. Reescrita la descripción/acceptance_criteria de `f-006-budget-expenses` en `feature_list.json` para reflejar el modelo correcto (gastos con etiquetas libres, coste total = suma de gastos).

Además, petición de UX: `trip/new.tsx` pasa de formulario largo único a wizard de 3 pasos (nombre → destinos → fechas) con indicador de progreso. `trip/[id].tsx` (editar) se mantiene como formulario único a propósito — un wizard ahí sería fricción sin beneficio, ya hay contexto suficiente al editar.

`tsc --noEmit`, `npm test` (9 tests, incluye `formatDestinations`) y `expo start --web` sin errores. Migraciones `0002`/`0003` aplicadas contra Supabase real. Pendiente de que el usuario vuelva a probar en el Pixel 7.
