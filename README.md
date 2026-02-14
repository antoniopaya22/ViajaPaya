# 🌍 ViajaPayá — Tu organizador de viajes personal

Aplicación móvil de gestión personal de viajes construida con **React Native + Expo SDK 54**.
No es un buscador de vuelos ni un comparador de hoteles: es el organizador definitivo para que el viajero tenga todo lo que necesita en un solo lugar.

---

## 📑 Índice

- [Inicio rápido](#-inicio-rápido)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Navegación](#-navegación)
- [Stack tecnológico](#-stack-tecnológico)
- [Estado de implementación por épica](#-estado-de-implementación-por-épica)
  - [EP-01 Gestión de Viajes](#ep-01-gestión-de-viajes)
  - [EP-02 Transportes](#ep-02-transportes)
  - [EP-03 Alojamientos](#ep-03-alojamientos)
  - [EP-04 Actividades](#ep-04-actividades)
  - [EP-05 Documentación Personal](#ep-05-documentación-personal)
  - [EP-06 Adjuntos y Documentos](#ep-06-adjuntos-y-documentos)
  - [EP-07 Resumen y Timeline](#ep-07-resumen-y-timeline)
  - [EP-08 Presupuesto y Gastos](#ep-08-presupuesto-y-gastos)
  - [EP-09 Checklist de Equipaje](#ep-09-checklist-de-equipaje)
  - [EP-10 Notas y Consejos](#ep-10-notas-y-consejos)
- [Resumen global de progreso](#-resumen-global-de-progreso)
- [Próximos pasos recomendados](#-próximos-pasos-recomendados)
- [Documentación de referencia](#-documentación-de-referencia)
- [Scripts disponibles](#-scripts-disponibles)
- [Convenciones de código](#-convenciones-de-código)

---

## 🚀 Inicio rápido

### Requisitos previos

- **Node.js** ≥ 18
- **npm** ≥ 9 (o yarn/pnpm)
- **Expo CLI**: `npm install -g expo-cli` (opcional, se puede usar `npx expo`)
- **Expo Go** en tu dispositivo físico, o un emulador Android / simulador iOS configurado

### Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd TestApp

# 2. Instalar dependencias
npm install

# 3. (Recomendado) Alinear dependencias con Expo SDK 54
npx expo install --fix

# 4. Levantar el servidor de desarrollo
npx expo start
```

> **Nota:** Al arrancar por primera vez, expo-router regenera los tipos de las rutas. Esto elimina warnings de TypeScript sobre rutas no reconocidas.

### Ejecutar en dispositivo

- **Expo Go**: Escanea el QR del terminal con la app Expo Go.
- **Android**: `npx expo start --android`
- **iOS**: `npx expo start --ios`
- **Web**: `npx expo start --web`

### Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| `Unable to resolve path to module '@/...'` en el editor | Asegúrate de que tu IDE lee `tsconfig.json` con el path alias `@/*`. Metro lo resuelve correctamente en runtime. |
| Tipos de rutas no reconocidos por TypeScript | Arranca `npx expo start` para que expo-router regenere `.expo/types/router.d.ts`. |
| Conflictos de peer dependencies | Ejecuta `npm install --legacy-peer-deps` o usa `npx expo install --fix`. |
| Cache corrupta | `npx expo start --clear` |

---

## 🏗️ Arquitectura del proyecto

```
TestApp/
├── app/                          # Rutas (expo-router, file-based routing)
│   ├── (tabs)/                   # Tab navigator (bottom tabs)
│   │   ├── _layout.tsx           # Configuración del tab navigator
│   │   ├── index.tsx             # 🏠 Lista de viajes (pantalla principal)
│   │   ├── wallet.tsx            # 🪪 Mi Cartera (documentación personal)
│   │   └── settings.tsx          # ⚙️ Ajustes
│   ├── trip/                     # Pantallas de viaje (stack navigation)
│   │   ├── [id].tsx              # 📋 Detalle del viaje (tabs internos)
│   │   ├── create.tsx            # ➕ Crear viaje
│   │   ├── edit.tsx              # ✏️ Editar viaje
│   │   ├── transport-form.tsx    # ✈️ Formulario transporte (crear/editar)
│   │   ├── accommodation-form.tsx# 🏨 Formulario alojamiento (crear/editar)
│   │   ├── activity-form.tsx     # 🎭 Formulario actividad (crear/editar)
│   │   ├── expense-form.tsx      # 💰 Formulario gasto (crear/editar)
│   │   └── note-form.tsx         # 📝 Formulario nota (crear/editar)
│   └── _layout.tsx               # Root layout (Stack global)
│
├── components/
│   ├── ui/                       # Componentes UI genéricos reutilizables
│   │   ├── Card.tsx              # Tarjeta con estilos base
│   │   ├── EmptyState.tsx        # Estado vacío con CTA
│   │   ├── FAB.tsx               # Floating Action Button
│   │   ├── GradientHeader.tsx    # Header con gradiente
│   │   └── index.ts              # Barrel export
│   └── trip/                     # Componentes específicos del viaje (tabs)
│       ├── TripOverview.tsx      # 📊 Tab Resumen
│       ├── TripTransports.tsx    # ✈️ Tab Transportes
│       ├── TripAccommodations.tsx# 🏨 Tab Alojamientos
│       ├── TripActivities.tsx    # 🎭 Tab Actividades
│       ├── TripBudget.tsx        # 💰 Tab Presupuesto
│       ├── TripChecklist.tsx     # 🧳 Tab Checklist
│       ├── TripNotes.tsx         # 📝 Tab Notas
│       └── index.ts              # Barrel export
│
├── hooks/
│   ├── useAppTheme.ts            # Tema/colores según dark/light mode
│   ├── useTripDetail.ts          # Hook principal: CRUD de viaje + sub-entidades
│   └── useTrips.ts               # Hook: lista de viajes categorizada
│
├── services/
│   └── storage.ts                # Persistencia con AsyncStorage (CRUD genérico)
│
├── types/                        # Modelos de dominio (TypeScript)
│   ├── trip.ts                   # Trip, TripStatus, helpers
│   ├── transport.ts              # Transport, TransportType, Attachment
│   ├── accommodation.ts          # Accommodation, AccommodationType
│   ├── activity.ts               # Activity, ActivityType, PaymentStatus
│   ├── expense.ts                # Expense, ExpenseCategory, CURRENCIES
│   ├── checklist.ts              # ChecklistItem, templates, helpers
│   ├── note.ts                   # Note, NoteCategory, helpers
│   └── index.ts                  # Barrel re-export (evita duplicados)
│
├── theme/                        # Design tokens
│   └── index.ts                  # spacing, radius, shadow, fontSize, fontWeight
│
├── constants/
│   └── colors.ts                 # Paleta: Brand, Status, Neutral
│
├── docs/                         # 📚 Especificación funcional (épicas + HUs)
│   ├── 00-vision-general.md
│   ├── 01-gestion-viajes.md
│   ├── 02-transportes.md
│   ├── 03-alojamientos.md
│   ├── 04-actividades.md
│   ├── 05-documentacion-personal.md
│   ├── 06-adjuntos-documentos.md
│   ├── 07-resumen-timeline.md
│   ├── 08-presupuesto-gastos.md
│   ├── 09-checklist-equipaje.md
│   └── 10-notas-consejos.md
│
└── package.json
```

### Principios de arquitectura

1. **Dominio como aggregate root**: `Trip` es la entidad raíz. Todas las sub-entidades (transports, accommodations, etc.) viven dentro del Trip y se persisten como parte de él.
2. **Un hook, un viaje**: `useTripDetail(tripId)` expone todo el CRUD de un viaje y sus sub-entidades con un contrato simple (estado + acciones).
3. **Persistencia local**: Todo se almacena en `AsyncStorage` vía `services/storage.ts`. No hay backend ni API remota.
4. **Design tokens centralizados**: Todos los estilos usan `theme/` (spacing, radius, shadow, typography) y `constants/colors.ts`.
5. **Imports estables**: Alias `@/` + barrels (`types/index.ts`, `components/ui/index.ts`).
6. **File-based routing**: expo-router gestiona toda la navegación. Cada archivo en `app/` es una ruta.

---

## 🧭 Navegación

```
🏠 Lista de Viajes (tabs/index)
│
├── ➕ Crear Viaje (trip/create)
│
└── 📋 Detalle del Viaje (trip/[id])
    │
    ├── 📊 Resumen (TripOverview)          ← Tab por defecto
    ├── ✈️ Transportes (TripTransports)
    │   └── Formulario (trip/transport-form)    ← Crear / Editar
    ├── 🏨 Alojamientos (TripAccommodations)
    │   └── Formulario (trip/accommodation-form) ← Crear / Editar
    ├── 🎭 Actividades (TripActivities)
    │   └── Formulario (trip/activity-form)      ← Crear / Editar
    ├── 💰 Presupuesto (TripBudget)
    │   └── Formulario (trip/expense-form)       ← Crear / Editar
    ├── 🧳 Checklist (TripChecklist)             ← Inline CRUD
    └── 📝 Notas (TripNotes)
        └── Formulario (trip/note-form)          ← Crear / Editar
    │
    └── ✏️ Editar Viaje (trip/edit)

🪪 Mi Cartera (tabs/wallet)               ← Placeholder (EP-05)
⚙️ Ajustes (tabs/settings)                ← Funcional
```

---

## 🛠️ Stack tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | React Native (Expo SDK 54) | 0.81.4 |
| Navegación | expo-router (file-based) | ~6.0.6 |
| Estado | React hooks (useState, useCallback) | 19.1.0 |
| Persistencia | @react-native-async-storage/async-storage | ^2.2.0 |
| UI / Gradientes | expo-linear-gradient | ~15.0.7 |
| Iconos | @expo/vector-icons (Ionicons) | ^15.0.2 |
| Animaciones | react-native-reanimated | ~4.1.0 |
| Gestos | react-native-gesture-handler | ~2.28.0 |
| Date Picker | react-native-date-picker | ^5.0.13 |
| Lenguaje | TypeScript | ~5.9.2 |

---

## 📊 Estado de implementación por épica

### Leyenda

| Icono | Significado |
|-------|-------------|
| ✅ | Implementado y funcional |
| ⚠️ | Parcialmente implementado (faltan detalles o UI incompleta) |
| ❌ | No implementado |
| 🔲 | No aplica en esta fase (Won't / prioridad baja) |

---

### EP-01: Gestión de Viajes
> **Documento:** [`docs/01-gestion-viajes.md`](docs/01-gestion-viajes.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-1.1 | Crear un viaje | Alta | ✅ | `trip/create.tsx` — nombre, destino, fechas, descripción, imagen de portada, presupuesto |
| HU-1.2 | Listar mis viajes | Alta | ✅ | `(tabs)/index.tsx` — secciones Próximos/En curso/Pasados, countdown, pull-to-refresh, FAB |
| HU-1.3 | Ver detalle de un viaje | Alta | ✅ | `trip/[id].tsx` — 7 tabs (resumen, transportes, alojamientos, actividades, presupuesto, checklist, notas) |
| HU-1.4 | Editar un viaje | Alta | ✅ | `trip/edit.tsx` — todos los campos editables |
| HU-1.5 | Eliminar un viaje | Alta | ✅ | Confirmación con Alert, elimina todo el contenido asociado |
| HU-1.6 | Duplicar un viaje | Baja | ❌ | — |
| HU-1.7 | Compartir resumen del viaje | Baja | ❌ | — |

**Progreso EP-01: 5/7 (71%)** — Funcionalidad core completa. Falta duplicar y compartir (prioridad baja).

---

### EP-02: Transportes
> **Documento:** [`docs/02-transportes.md`](docs/02-transportes.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-02-01 | Añadir transporte | Alta | ✅ | `trip/transport-form.tsx` — selector de tipo + formulario adaptado |
| HU-02-02 | Datos de vuelo | Alta | ✅ | Campos: aerolínea, nº vuelo, terminales, puerta, asiento, clase |
| HU-02-03 | Datos de tren | Alta | ✅ | Campos: compañía, nº tren, vagón, asiento |
| HU-02-04 | Datos de autobús | Media | ✅ | Campos genéricos de transporte |
| HU-02-05 | Datos de ferry | Baja | ✅ | Campos genéricos de transporte |
| HU-02-06 | Datos de coche de alquiler | Media | ✅ | Campos específicos: recogida/devolución, seguro, asistencia |
| HU-02-07 | Traslado / taxi | Baja | ✅ | Campos: conductor, teléfono, punto de encuentro |
| HU-02-08 | Transporte genérico | Media | ✅ | Tipo "Otro" con campos base |
| HU-02-09 | Adjuntar documentos | Alta | ❌ | Tipo `Attachment` definido, falta integración con picker |
| HU-02-10 | QR / código de barras | Alta | ❌ | — |
| HU-02-11 | Editar transporte | Alta | ✅ | Formulario en modo edición (pre-rellena datos existentes) |
| HU-02-12 | Eliminar transporte | Alta | ✅ | Confirmación con Alert |
| HU-02-13 | Listar transportes | Alta | ✅ | `TripTransports.tsx` — lista cronológica con iconos por tipo |
| HU-02-14 | Ver detalle de transporte | Alta | ⚠️ | Información visible en la lista, sin pantalla de detalle dedicada |
| HU-02-15 | Notas en transporte | Media | ✅ | Campo de notas en el formulario |
| HU-02-16 | Coste del transporte | Media | ✅ | Campos coste + moneda |

**Progreso EP-02: 12/16 (75%)** — CRUD completo. Falta adjuntos, QR y pantalla de detalle dedicada.

---

### EP-03: Alojamientos
> **Documento:** [`docs/03-alojamientos.md`](docs/03-alojamientos.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-3.1 | Añadir alojamiento | Alta | ✅ | `trip/accommodation-form.tsx` — 11 tipos + formulario completo |
| HU-3.2 | Listar alojamientos | Alta | ✅ | `TripAccommodations.tsx` — lista con cálculo de noches |
| HU-3.3 | Ver detalle | Alta | ⚠️ | Info inline en lista, sin pantalla de detalle dedicada |
| HU-3.4 | Editar alojamiento | Alta | ✅ | Formulario en modo edición |
| HU-3.5 | Eliminar alojamiento | Alta | ✅ | Confirmación con Alert |
| HU-3.6 | Adjuntar documentos | Alta | ❌ | Tipo definido, sin picker/upload |
| HU-3.7 | Info check-in/check-out | Media | ✅ | Campos: hora, instrucciones de llegada, nº habitación, contacto, parking |
| HU-3.8 | Tipos personalizados | Media | ✅ | 11 tipos predefinidos + "Otro" con nombre personalizado |
| HU-3.9 | Copiar datos al portapapeles | Media | ❌ | — |
| HU-3.10 | Vista de mapa | Baja | ❌ | — |

**Progreso EP-03: 6/10 (60%)** — CRUD y tipos completos. Falta adjuntos, copiar datos y mapa.

---

### EP-04: Actividades
> **Documento:** [`docs/04-actividades.md`](docs/04-actividades.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-4.1 | Listar actividades | Alta | ✅ | `TripActivities.tsx` — lista cronológica con iconos por tipo |
| HU-4.2 | Añadir actividad | Alta | ✅ | `trip/activity-form.tsx` — 9 tipos, todos los campos de la spec |
| HU-4.3 | Ver detalle | Alta | ⚠️ | Info inline, sin pantalla dedicada |
| HU-4.4 | Editar actividad | Alta | ✅ | Formulario en modo edición |
| HU-4.5 | Eliminar actividad | Alta | ✅ | Confirmación con Alert |
| HU-4.6 | Adjuntar documentos | Alta | ❌ | Tipo definido, sin implementación |
| HU-4.7 | Ver QR de entrada | Media | ❌ | — |
| HU-4.8 | Filtrar por tipo | Media | ❌ | — |
| HU-4.9 | Ver en mapa | Baja | ❌ | — |
| HU-4.10 | Marcar completada | Baja | ✅ | `toggleActivityCompleted` en hook |
| HU-4.11 | Recordatorio | Baja | ❌ | Requiere `expo-notifications` |

**Progreso EP-04: 5/11 (45%)** — CRUD core completo. Faltan adjuntos, filtros, mapa y recordatorios.

---

### EP-05: Documentación Personal
> **Documento:** [`docs/05-documentacion-personal.md`](docs/05-documentacion-personal.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-5.1 | Listar documentos personales | Alta | ❌ | Pantalla placeholder en `wallet.tsx` con preview de tipos |
| HU-5.2 | Añadir DNI / ID Card | Alta | ❌ | — |
| HU-5.3 | Añadir pasaporte | Alta | ❌ | — |
| HU-5.4 | Añadir visado | Media | ❌ | — |
| HU-5.5 | Tarjeta sanitaria / seguro | Media | ❌ | — |
| HU-5.6 | Carnet de conducir | Baja | ❌ | — |
| HU-5.7 | Documento genérico | Media | ❌ | — |
| HU-5.8 | Ver detalle documento | Alta | ❌ | — |
| HU-5.9 | Editar documento | Alta | ❌ | — |
| HU-5.10 | Eliminar documento | Media | ❌ | — |
| HU-5.11 | Alerta de caducidad | Baja | ❌ | — |
| HU-5.12 | Modo mostrar (brillo máximo) | Media | ❌ | — |
| HU-5.13 | Vincular a viaje | Baja | ❌ | — |

**Progreso EP-05: 0/13 (0%)** — Solo placeholder UI. Épica completa pendiente.

---

### EP-06: Adjuntos y Documentos
> **Documento:** [`docs/06-adjuntos-documentos.md`](docs/06-adjuntos-documentos.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-06-01 | Adjuntar a transporte | Alta | ❌ | Interface `Attachment` definida en tipos |
| HU-06-02 | Adjuntar a alojamiento | Alta | ❌ | Interface `Attachment` definida en tipos |
| HU-06-03 | Adjuntar a actividad | Alta | ❌ | Interface `Attachment` definida en tipos |
| HU-06-04 | Visualizar adjunto | Alta | ❌ | — |
| HU-06-05 | Escanear QR desde adjunto | Media | ❌ | — |
| HU-06-06 | Capturar con cámara | Media | ❌ | — |
| HU-06-07 | Eliminar adjunto | Alta | ❌ | — |
| HU-06-08 | Renombrar adjunto | Baja | ❌ | — |
| HU-06-09 | Documento general del viaje | Media | ❌ | — |
| HU-06-10 | Vista consolidada de docs | Media | ❌ | — |
| HU-06-11 | Compartir adjunto | Baja | ❌ | — |

**Progreso EP-06: 0/11 (0%)** — Solo modelos de datos definidos. Requiere `expo-image-picker`, `expo-document-picker`, `expo-file-system`.

---

### EP-07: Resumen y Timeline
> **Documento:** [`docs/07-resumen-timeline.md`](docs/07-resumen-timeline.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-7.1 | Resumen general del viaje | Alta | ✅ | `TripOverview.tsx` — stats grid, budget progress, countdown |
| HU-7.2 | Timeline cronológico | Alta | ⚠️ | Mini-timeline en overview; falta timeline completo scrollable |
| HU-7.3 | Navegar al detalle desde timeline | Alta | ⚠️ | Funciona parcialmente desde el mini-timeline |
| HU-7.4 | Vista de día específico | Media | ❌ | — |
| HU-7.5 | Calendario visual | Media | ❌ | Evaluar `react-native-calendars` |
| HU-7.6 | Tarjetas resumen por categoría | Alta | ✅ | Stats grid con contadores y navegación a tabs |
| HU-7.7 | Indicador día actual | Media | ⚠️ | Badge "Día X de Y" existe; sin highlight en timeline |
| HU-7.8 | Detectar conflictos | Baja | ❌ | — |
| HU-7.9 | Cuenta atrás para el viaje | Baja | ✅ | "Faltan X días" / "Día X de Y" / "Finalizado" |
| HU-7.10 | Compartir resumen | Baja | ❌ | — |

**Progreso EP-07: 3/10 (30%)** — Resumen funcional. Timeline completo y calendario pendientes.

---

### EP-08: Presupuesto y Gastos
> **Documento:** [`docs/08-presupuesto-gastos.md`](docs/08-presupuesto-gastos.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-8.1 | Establecer presupuesto | Media | ✅ | Campo `budget` en Trip, barra de progreso en overview |
| HU-8.2 | Registrar gasto | Media | ✅ | `trip/expense-form.tsx` — concepto, importe, divisa, categoría, fecha |
| HU-8.3 | Editar gasto | Media | ✅ | Formulario en modo edición |
| HU-8.4 | Eliminar gasto | Media | ✅ | Confirmación con Alert |
| HU-8.5 | Listar gastos | Media | ✅ | `TripBudget.tsx` — lista con iconos de categoría |
| HU-8.6 | Resumen por categoría | Baja | ⚠️ | Helpers `getExpensesByCategory` listos; UI parcial |
| HU-8.7 | Múltiples divisas | Baja | ⚠️ | Selector de 27 divisas; sin conversión automática |
| HU-8.8 | Adjuntar ticket/factura | Baja | ❌ | — |
| HU-8.9 | Alerta de presupuesto | Baja | ⚠️ | Colores verde/amarillo/rojo definidos (`BUDGET_STATUS_COLORS`); UI parcial |
| HU-8.10 | Gasto diario medio | Baja | ⚠️ | Helper `getDailyAverageExpense` listo; sin UI dedicada |

**Progreso EP-08: 5/10 (50%)** — CRUD completo. Faltan gráficos, conversión de divisas y adjuntos.

---

### EP-09: Checklist de Equipaje
> **Documento:** [`docs/09-checklist-equipaje.md`](docs/09-checklist-equipaje.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| US-9.1 | Ver checklist del viaje | Media | ✅ | `TripChecklist.tsx` — progress bar, categorías con iconos |
| US-9.2 | Añadir ítem | Media | ✅ | Input inline con selector de categoría |
| US-9.3 | Marcar como preparado | Media | ✅ | Toggle con feedback visual y progreso actualizado |
| US-9.4 | Editar ítem | Baja | ⚠️ | Parcial (cambiar nombre posible, edición completa limitada) |
| US-9.5 | Eliminar ítem | Media | ✅ | Swipe o botón con confirmación |
| US-9.6 | Plantillas predefinidas | Media | ✅ | 4 plantillas: playa, montaña, negocios, genérico (20 ítems c/u) |
| US-9.7 | Organizar por categorías | Baja | ✅ | 7 categorías con colores e iconos, secciones colapsables |
| US-9.8 | Resetear checklist | Baja | ✅ | Desmarca todos los ítems con confirmación |
| US-9.9 | Categoría personalizada | Baja | ❌ | — |

**Progreso EP-09: 7/9 (78%)** — La épica más completa. Solo falta edición completa y categorías custom.

---

### EP-10: Notas y Consejos
> **Documento:** [`docs/10-notas-consejos.md`](docs/10-notas-consejos.md)

| ID | Historia | Prioridad | Estado | Notas |
|----|----------|-----------|--------|-------|
| HU-10.1 | Crear nota | Media | ✅ | `trip/note-form.tsx` — título, contenido, categoría |
| HU-10.2 | Listar notas | Media | ✅ | `TripNotes.tsx` — pinned primero, preview del contenido |
| HU-10.3 | Editar nota | Media | ✅ | Formulario en modo edición |
| HU-10.4 | Eliminar nota | Media | ✅ | Confirmación con Alert |
| HU-10.5 | Categorizar notas | Baja | ⚠️ | 6 categorías definidas con iconos/colores; filtrado parcial |
| HU-10.6 | Fijar como destacada | Baja | ✅ | `toggleNotePin` — pinned notes aparecen primero |
| HU-10.7 | Consejos por destino | Baja | ❌ | — |
| HU-10.8 | Buscar en notas | Baja | ⚠️ | Helper `searchNotes` listo; UI de búsqueda no confirmada |
| HU-10.9 | Compartir nota | Baja | ❌ | Requiere React Native `Share` API |

**Progreso EP-10: 5/9 (56%)** — CRUD y pin completos. Faltan consejos automáticos, búsqueda UI y compartir.

---

## 📈 Resumen global de progreso

| Épica | Descripción | Implementadas | Total | % |
|-------|-------------|:------------:|:-----:|:-:|
| EP-01 | Gestión de Viajes | 5 | 7 | 71% |
| EP-02 | Transportes | 12 | 16 | 75% |
| EP-03 | Alojamientos | 6 | 10 | 60% |
| EP-04 | Actividades | 5 | 11 | 45% |
| EP-05 | Documentación Personal | 0 | 13 | 0% |
| EP-06 | Adjuntos y Documentos | 0 | 11 | 0% |
| EP-07 | Resumen y Timeline | 3 | 10 | 30% |
| EP-08 | Presupuesto y Gastos | 5 | 10 | 50% |
| EP-09 | Checklist de Equipaje | 7 | 9 | 78% |
| EP-10 | Notas y Consejos | 5 | 9 | 56% |
| **TOTAL** | | **48** | **106** | **45%** |

### Lo que ya funciona (MVP core)

- ✅ Crear, listar, editar y eliminar viajes
- ✅ Vista de detalle con 7 tabs
- ✅ CRUD completo de transportes (7 tipos)
- ✅ CRUD completo de alojamientos (11 tipos)
- ✅ CRUD completo de actividades (9 tipos) con toggle completada
- ✅ CRUD completo de gastos con 8 categorías y 27 divisas
- ✅ Checklist con plantillas predefinidas y progress tracking
- ✅ Notas con categorías y pin
- ✅ Resumen del viaje con stats, countdown y mini-timeline
- ✅ Presupuesto con barra de progreso y estados (ok/warning/danger)
- ✅ Persistencia local (AsyncStorage)
- ✅ Pantalla de ajustes funcional (borrar datos, info de app)
- ✅ Design system consistente (tokens, componentes UI reutilizables)

### Lo que falta (priorizado)

1. 🔴 **EP-06 Adjuntos** — Bloquea varias HUs de alta prioridad en EP-02, 03, 04
2. 🔴 **EP-05 Documentación Personal** — Épica completa pendiente
3. 🟡 **EP-07 Timeline completo** — Solo mini-timeline implementado
4. 🟡 **Pantallas de detalle dedicadas** — Transportes, alojamientos, actividades (actualmente inline)
5. 🟢 **Filtros y búsqueda** — En actividades y notas
6. 🟢 **Compartir** — Viaje, notas (React Native Share API)
7. 🔵 **Mejoras UX** — Animaciones, calendario visual, mapas

---

## 🎯 Próximos pasos recomendados

### Iteración 1 — Adjuntos (desbloquea EP-06 + HUs de EP-02/03/04)
> **Impacto: Alto** — Desbloquea ~15 historias de usuario.

1. Instalar dependencias:
   ```bash
   npx expo install expo-image-picker expo-document-picker expo-file-system
   ```
2. Crear servicio `services/fileStorage.ts` para gestionar archivos locales
3. Crear componente `components/ui/AttachmentPicker.tsx` (galería + cámara + documento)
4. Crear componente `components/ui/AttachmentViewer.tsx` (visor fullscreen con zoom)
5. Integrar en formularios de transporte, alojamiento y actividad
6. Implementar visualización de adjuntos en las listas/detalle

### Iteración 2 — Documentación Personal (EP-05)
> **Impacto: Alto** — Épica completa nueva.

1. Definir modelo `types/personalDocument.ts`
2. Crear servicio de persistencia para documentos personales
3. Implementar pantallas CRUD en `app/wallet/`
4. Integrar con image picker para escaneo de documentos
5. Modo "mostrar" (brillo máximo, keep awake)

### Iteración 3 — Timeline completo y pantallas de detalle (EP-07)
> **Impacto: Medio** — Mejora significativa de UX.

1. Implementar timeline completo con `SectionList` agrupado por día
2. Crear pantallas de detalle dedicadas para transporte, alojamiento, actividad
3. Navegación desde timeline a detalle y vuelta
4. Evaluar e integrar `react-native-calendars` para vista de calendario

### Iteración 4 — Pulido y mejoras UX
> **Impacto: Medio** — Experiencia de usuario profesional.

1. Animaciones de transición entre tabs (`react-native-reanimated`)
2. Filtros en listas (actividades por tipo, gastos por categoría)
3. Búsqueda en notas (UI)
4. Gráficos de presupuesto por categoría
5. Compartir viaje y notas (React Native `Share`)
6. Conversión de divisas (manual)

### Iteración 5 — Calidad y testing

1. Corregir errores TypeScript preexistentes (`tsc --noEmit`)
2. Tests unitarios para hooks y services (Jest)
3. Tests de componentes (React Native Testing Library)
4. Tests e2e de flujos críticos (Detox o Maestro)

---

## 📚 Documentación de referencia

Toda la especificación funcional está en la carpeta `docs/`:

| Archivo | Contenido |
|---------|-----------|
| [`00-vision-general.md`](docs/00-vision-general.md) | Visión del proyecto, épicas, conceptos clave, prioridades MoSCoW |
| [`01-gestion-viajes.md`](docs/01-gestion-viajes.md) | HU-1.1 a HU-1.7 — CRUD de viajes |
| [`02-transportes.md`](docs/02-transportes.md) | HU-02-01 a HU-02-16 — Todos los tipos de transporte |
| [`03-alojamientos.md`](docs/03-alojamientos.md) | HU-3.1 a HU-3.10 — Hoteles, apartamentos, etc. |
| [`04-actividades.md`](docs/04-actividades.md) | HU-4.1 a HU-4.11 — Excursiones, visitas, tours |
| [`05-documentacion-personal.md`](docs/05-documentacion-personal.md) | HU-5.1 a HU-5.13 — DNI, pasaporte, visados |
| [`06-adjuntos-documentos.md`](docs/06-adjuntos-documentos.md) | HU-06-01 a HU-06-11 — Archivos adjuntos |
| [`07-resumen-timeline.md`](docs/07-resumen-timeline.md) | HU-7.1 a HU-7.10 — Resumen e itinerario |
| [`08-presupuesto-gastos.md`](docs/08-presupuesto-gastos.md) | HU-8.1 a HU-8.10 — Control financiero |
| [`09-checklist-equipaje.md`](docs/09-checklist-equipaje.md) | US-9.1 a US-9.9 — Listas de equipaje |
| [`10-notas-consejos.md`](docs/10-notas-consejos.md) | HU-10.1 a HU-10.9 — Notas del viaje |

---

## 📜 Scripts disponibles

```bash
# Levantar servidor de desarrollo
npx expo start

# Ejecutar en Android
npx expo start --android

# Ejecutar en iOS
npx expo start --ios

# Ejecutar en web
npx expo start --web

# Limpiar cache
npx expo start --clear

# Verificar TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Alinear dependencias con Expo SDK
npx expo install --fix

# Diagnóstico de Expo
npx expo-doctor
```

---

## 📐 Convenciones de código

### Estructura de archivos

- **Pantallas** (`app/`): Composición de componentes + navegación. Mínima lógica.
- **Componentes** (`components/`): UI reutilizable. Props tipadas. Sin lógica de negocio.
- **Hooks** (`hooks/`): Lógica de estado y efectos. Exponen contrato simple (estado + acciones).
- **Services** (`services/`): Capa de persistencia/API. Funciones async puras.
- **Types** (`types/`): Interfaces, enums, constantes de dominio, helpers puros.

### Convenciones de nombrado

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | PascalCase | `TripOverview.tsx` |
| Hooks | camelCase con `use` prefix | `useTripDetail.ts` |
| Services | camelCase | `storage.ts` |
| Types | PascalCase (interfaces), UPPER_SNAKE (constantes) | `Trip`, `TRANSPORT_TYPES` |
| Archivos de ruta | kebab-case | `transport-form.tsx` |

### Imports

```typescript
// 1. React / React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. Librerías externas
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 3. Internos con alias @/
import { useAppTheme } from '@/hooks/useAppTheme';
import { Trip } from '@/types/trip';
import { GradientHeader } from '@/components/ui';
import { spacing, radius } from '@/theme';
```

### Estilos

- Usar siempre tokens de `theme/` (spacing, radius, shadow, fontSize, fontWeight).
- Colores desde `useAppTheme()` (soporta dark/light mode) o `constants/colors.ts`.
- `StyleSheet.create()` al final del archivo.

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.

---

*Última actualización del README: Febrero 2025*