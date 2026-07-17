# ADR 0002: Supabase para autenticación (SSO) y base de datos

## Estado

Aceptado. Amplía [0001-local-first-storage.md](0001-local-first-storage.md) (no lo revierte).

## Contexto

El usuario quiere autenticación SSO (login social/SSO en vez de usuario+contraseña propio) y una base de datos remota, usando un proyecto Supabase ya creado:

- Project name: `viajaPaya`
- Project ID (ref): `eltpqbxcfoouwweqockh`
- Región: `eu-west-1` (West EU, Ireland)

Sigue existiendo el requisito original de ADR 0001: acceso offline instantáneo a documentos/QR/horarios durante el viaje, sin depender de conexión.

## Decisión

Arquitectura híbrida:

- **Supabase Auth** para SSO (login social: Google/Apple, etc.) — sustituye cualquier sistema de auth propio.
- **Supabase Postgres** como base de datos remota / fuente de verdad y para sincronización entre dispositivos del mismo usuario.
- **Caché local** (la capa de `src/services/` de ADR 0001) se mantiene para los datos críticos de acceso offline (documentos, próximo transporte, QR): se sincronizan desde Supabase pero se leen localmente cuando no hay red.
- El cliente de Expo usa únicamente `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` (claves públicas, protegidas por Row Level Security en Supabase). La contraseña de la base de datos y el project ref **no** se usan desde el cliente — solo para tareas locales de desarrollo (CLI, migraciones).

## Gestión de secretos

- `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID` y `SUPABASE_PROJECT_REGION` viven únicamente en `.env.local` (gitignored, nunca comiteado). Ver `.env.example` para la plantilla sin valores.
- `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY` (claves públicas) se rellenan en `.env.local` cuando se obtengan del dashboard de Supabase (Project Settings → API); no son secretas pero tampoco se hardcodean en el código, se leen de variables de entorno.
- Row Level Security (RLS) debe estar activo en todas las tablas desde el primer día: sin RLS, la clave `anon` pública da acceso de lectura/escritura sin restricción.

## Consecuencias

- Se añade una entidad `User` (gestionada por Supabase Auth) como propietaria de sus `Trip`.
- Las tablas de Postgres reflejan el modelo de [domain-model.md](../domain-model.md): `trips`, `bookings`, `expenses`, `documents`, `itinerary_items`, todas con `user_id` y políticas RLS `user_id = auth.uid()`.
- Se necesita conectividad para el alta/edición y para sincronizar entre dispositivos; la consulta de datos ya sincronizados sigue funcionando offline vía la caché local.

## Disparador para reconsiderar

Si en el futuro se necesita self-host de la base de datos, o SSO empresarial (SAML) no soportado por el plan de Supabase actual, revisar esta decisión.
