# Arquitectura

## Estado

Harness listo, app sin arrancar todavía. Esta arquitectura es el objetivo para cuando se implemente `f-000-project-bootstrap`.

## Enrutado

Expo Router, con `src/app/` como raíz de rutas (Expo Router detecta automáticamente `src/app` si existe, sin necesidad de un `app/` en la raíz del repo). Todo el código vive bajo `src/`; solo `assets/` queda en la raíz del repo (convención de `app.json` para iconos/splash).

## Capas

```
src/
├── app/          # rutas (Expo Router): pantallas y layouts
├── components/   # componentes de UI reutilizables
├── services/     # acceso a datos/persistencia (capa única de storage)
├── types/        # tipos TypeScript del dominio
├── hooks/        # hooks reutilizables
├── constants/    # constantes, temas, configuración estática
├── utils/        # utilidades puras sin estado
└── __tests__/    # tests, espejo de las carpetas anteriores
```

## Estado, persistencia y backend

Estado local por pantalla/componente (sin store global inicialmente). Toda persistencia pasa por una capa de servicios única en `src/services/`, para poder cambiar la estrategia sin tocar componentes.

Backend: Supabase (Auth SSO + Postgres) como fuente de verdad remota y punto de sincronización entre dispositivos; caché local (AsyncStorage) para los datos de acceso crítico offline (documentos, próximo transporte). Ver [decisions/0001-local-first-storage.md](decisions/0001-local-first-storage.md) y [decisions/0002-supabase-backend.md](decisions/0002-supabase-backend.md). El cliente de Supabase se inicializa en `src/services/supabase.ts` leyendo `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY` de variables de entorno, nunca hardcodeadas.

## Navegación (previsto)

- Tabs principales: Viajes, Documentos, Ajustes.
- Detalle de viaje (`trip/[id]`) con subsecciones: resumen/itinerario, reservas, presupuesto, documentos.

Esto se refinará cuando se implemente `f-000` y las features de navegación asociadas.
