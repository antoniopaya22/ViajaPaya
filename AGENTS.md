# ViajaPayá

Aplicación móvil (Expo / React Native) de gestión de viajes ya reservados: reservas (vuelos, trenes, hoteles, actividades), presupuesto/gastos, documentos (pasaportes, DNIs, entradas/QR) e itinerario. Objetivo: durante el viaje, acceso rápido offline a cualquier QR, documento escaneado, u hora/terminal de un transporte.

## Estado actual

Proyecto Expo arrancado (`f-000-project-bootstrap`, done) con sistema de diseño y layout base (`f-012-design-system-layout`, done): tema claro/oscuro, componentes reutilizables en `src/components/ui`, y navegación por tabs (Viajes/Documentos/Ajustes). Los datos de las pantallas son de ejemplo — la gestión real de viajes/reservas/documentos llega con `f-001` en adelante.

Proyecto ya registrado en EAS: slug `viajapaya`, owner `payarroni`, project ID `8291752b-7169-4b66-866a-dd516ae047cb`.

## Stack objetivo

Expo (Router, `src/app` como raíz), React Native, TypeScript estricto, alias `@/*`. Ver [docs/tech-stack.md](docs/tech-stack.md).

## Documentación

- [docs/architecture.md](docs/architecture.md) — estructura de carpetas y capas.
- [docs/domain-model.md](docs/domain-model.md) — entidades del dominio.
- [docs/conventions.md](docs/conventions.md) — convenciones de código y test.
- [docs/tech-stack.md](docs/tech-stack.md) — stack y paquetes previstos.
- [docs/decisions/](docs/decisions/) — ADRs (decisiones técnicas, append-only).

## Flujo de trabajo (backlog → spec → progreso)

1. **`feature_list.json`** — backlog plano: qué features existen y su estado de alto nivel.
2. **`specs/<feature-id>/`** — spec detallada por feature (Kiro-style): `requirements.md` (EARS), `design.md`, `tasks.md`. Se crea al arrancar la feature.
3. **`progress/current.md`** — puntero vivo de la sesión activa (qué feature, qué tarea).
4. **`progress/history.md`** — log histórico append-only de features completadas.

No se edita `feature_list.json` a mano: usar `/feature:new` y `/feature:start`. Detalle completo en [.claude/skills/spec-workflow/SKILL.md](.claude/skills/spec-workflow/SKILL.md).

## Cómo correr el proyecto

```
npm install
npm start          # expo start
npm run web        # expo start --web
npm run typecheck  # tsc --noEmit
npm test           # jest
```

Variables de entorno (Supabase) en `.env.local` — copiar `.env.example` si no existe. Ver [docs/tech-stack.md](docs/tech-stack.md).
