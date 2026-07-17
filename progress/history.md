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
