# ViajaPayá - Visión General del Proyecto

## 📌 Descripción

**ViajaPayá** es una aplicación móvil de gestión personal de viajes. No es un buscador de vuelos ni un comparador de hoteles: es el **organizador definitivo** para que el viajero tenga todo lo que necesita en un solo lugar.

El usuario puede crear viajes, añadir transportes, alojamientos y actividades, adjuntar documentación (billetes, reservas, QR), gestionar su documentación personal (DNI, pasaporte, visados), controlar su presupuesto y preparar su equipaje con checklists.

---

## 🎯 Objetivo

Centralizar toda la información de un viaje en una única aplicación para que el usuario:

- No tenga que buscar billetes en el correo electrónico.
- Pueda enseñar su documentación personal desde el móvil.
- Tenga una vista clara de su itinerario día a día.
- Controle cuánto lleva gastado.
- No se olvide de meter nada en la maleta.

---

## 👤 Público Objetivo

Cualquier persona que viaje y quiera tener su viaje organizado. Desde el viajero frecuente que necesita orden, hasta el viajero ocasional que quiere tenerlo todo a mano sin complicaciones.

---

## 🏗️ Épicas del Proyecto

| Épica | Documento | Descripción |
|-------|-----------|-------------|
| EP-01 | [Gestión de Viajes](./01-gestion-viajes.md) | Crear, editar, eliminar y listar viajes |
| EP-02 | [Transportes](./02-transportes.md) | Gestión de vuelos, trenes, buses, ferris, coches de alquiler, etc. |
| EP-03 | [Alojamientos](./03-alojamientos.md) | Gestión de hoteles, apartamentos, hostales, etc. |
| EP-04 | [Actividades](./04-actividades.md) | Gestión de actividades, excursiones, visitas y reservas |
| EP-05 | [Documentación Personal](./05-documentacion-personal.md) | DNI, pasaporte, visados, tarjetas de seguro, carnets |
| EP-06 | [Documentos y Adjuntos](./06-adjuntos-documentos.md) | Adjuntar billetes, reservas, QR codes, PDFs e imágenes |
| EP-07 | [Resumen y Timeline](./07-resumen-timeline.md) | Vista resumen del viaje e itinerario día a día |
| EP-08 | [Presupuesto y Gastos](./08-presupuesto-gastos.md) | Control de presupuesto y registro de gastos |
| EP-09 | [Checklist de Equipaje](./09-checklist-equipaje.md) | Listas de cosas que llevar en la maleta |
| EP-10 | [Notas del Viaje](./10-notas-consejos.md) | Notas personales, tips y recordatorios |

---

## 🔑 Conceptos Clave del Dominio

- **Viaje**: Entidad principal. Tiene un destino (o varios), fechas de inicio y fin, y agrupa todo lo demás.
- **Transporte**: Cualquier medio de desplazamiento contratado (vuelo, tren, bus, ferry, coche de alquiler, transfer...).
- **Alojamiento**: Lugar donde el usuario se hospeda durante el viaje.
- **Actividad**: Cualquier cosa que el usuario tenga planificada (visita guiada, excursión, entrada a museo, espectáculo, restaurante reservado...).
- **Documento Personal**: Documentos de identidad y otros documentos personales del viajero (DNI, pasaporte, visado, seguro de viaje, carnet de conducir...).
- **Adjunto**: Archivo asociado a un transporte, alojamiento o actividad (PDF de reserva, imagen de billete, código QR...).
- **Gasto**: Registro económico asociado al viaje con categoría e importe.
- **Checklist**: Lista de elementos para preparar el equipaje.
- **Nota**: Texto libre asociado al viaje para recordatorios, tips o información útil.

---

## 📱 Navegación Principal (Propuesta)

```
Pantalla principal: Lista de Viajes
│
├── Crear / Editar Viaje
│
└── Detalle del Viaje
    ├── 📋 Resumen / Timeline
    ├── ✈️ Transportes
    ├── 🏨 Alojamientos
    ├── 🎭 Actividades
    ├── 💰 Presupuesto y Gastos
    ├── 🧳 Checklist Equipaje
    ├── 📝 Notas
    └── 📄 Documentos del Viaje

Acceso global (fuera de un viaje concreto):
├── 🪪 Documentación Personal (Mi Cartera)
└── ⚙️ Ajustes
```

---

## 🏷️ Prioridades

Las historias de usuario utilizan el sistema **MoSCoW**:

| Prioridad | Significado |
|-----------|-------------|
| **Must** | Imprescindible para el MVP |
| **Should** | Importante, pero puede esperar a una segunda iteración |
| **Could** | Deseable si hay tiempo |
| **Won't (por ahora)** | Descartado para esta fase |

---

## 📐 Convenciones de los Documentos

- Cada historia de usuario tiene un **ID único** con formato `HU-XX-YY` donde `XX` es el número de épica e `YY` el número de historia.
- El formato de cada historia es:
  - **ID**
  - **Título**
  - **Descripción**: _Como [rol], quiero [acción] para [beneficio]_
  - **Criterios de aceptación**
  - **Prioridad** (MoSCoW)
  - **Notas** (opcional)