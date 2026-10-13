# ViajaPayá

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Status](https://img.shields.io/badge/status-en_desarrollo-F59E0B)

Aplicación móvil para gestionar **viajes ya reservados** en un único sitio: reservas (vuelos, trenes, alojamiento y actividades), presupuesto y gastos, documentos (pasaportes, DNI, entradas y QR) e itinerario.

## Estado

| Funcionalidad | Estado |
|---|---|
| Proyecto Expo, sistema de diseño y layout (tema claro/oscuro) | ✅ |
| Supabase (cliente y esquema) | ✅ |
| Autenticación: email OTP y Google | ✅ |
| Gestión de viajes (CRUD) | 🚧 en curso |
| Reservas de vuelo, tren, alojamiento y actividades | 📋 |
| Presupuesto y gastos | 📋 |
| Gestor de documentos | 📋 |
| Itinerario y acceso rápido sin conexión | 📋 |

## Stack

Expo Router, React Native y TypeScript estricto, con Supabase (Auth + Postgres) como backend. Tests con Jest.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellena las variables de Supabase
npm start                    # expo start
npm run web
npm run typecheck
npm test
```

## Cómo se ha construido

Desarrollado con agentes de código siguiendo un flujo **backlog → spec → progreso** (`feature_list.json`, `specs/`, `progress/`), con la arquitectura, el modelo de dominio y las decisiones técnicas documentados en `docs/`. Ver `AGENTS.md`.
