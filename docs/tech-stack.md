# Stack técnico

## Estado

Nada instalado todavía. Este documento fija el objetivo para `f-000-project-bootstrap`; se actualiza con versiones reales una vez se instale.

## Proyecto Expo (EAS)

- Slug: `viajapaya`
- Owner: `payarroni`
- Project ID: `8291752b-7169-4b66-866a-dd516ae047cb`

## Objetivo

- Expo (SDK actual estable en el momento del bootstrap) + Expo Router.
- React Native + React (versiones que traiga el SDK de Expo elegido).
- TypeScript estricto.
- Backend: Supabase (Auth SSO + Postgres) como fuente de verdad remota, con caché local para acceso offline (ver [decisions/0001-local-first-storage.md](decisions/0001-local-first-storage.md) y [decisions/0002-supabase-backend.md](decisions/0002-supabase-backend.md)) — candidato inicial de caché: `@react-native-async-storage/async-storage`. Cliente: `@supabase/supabase-js`.
- Testing: `jest-expo` + React Native Testing Library.

## Supabase

- Project: `viajaPaya`, ref `eltpqbxcfoouwweqockh`, región `eu-west-1`.
- Auth: SSO/login social (Google, Apple, etc.) vía Supabase Auth.
- Credenciales (URL, anon key, project ref, contraseña de BBDD) viven solo en `.env.local` (gitignored) — ver `.env.example` para la plantilla. Nunca en código ni en docs.

## Paquetes previstos (no instalados aún, a añadir cuando la feature correspondiente los necesite)

- Selección/adjunto de archivos y fotos para documentos: `expo-image-picker`, `expo-document-picker`.
- Almacenamiento de archivos locales (escaneos, PDFs): `expo-file-system`.
- Lectura/visualización de QR: librería de cámara/escáner (a decidir en la spec de la feature de documentos/QR).
- Notificaciones (recordatorios de itinerario/actividades): `expo-notifications`.

Cada paquete se añade y se documenta (versión, motivo) cuando su feature asociada entra en `in-progress`, no antes.
