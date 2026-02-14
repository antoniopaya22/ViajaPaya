# Epic 10: Notas y Consejos del Viaje

## Descripción

Permite al usuario crear notas personales, consejos y recomendaciones asociadas a cada viaje. Un espacio libre donde apuntar información útil como frases en el idioma local, direcciones, recomendaciones de restaurantes, consejos de otros viajeros, números de emergencia, etc.

---

## Historias de Usuario

### HU-10.1: Crear nota en un viaje

**Como** usuario,
**quiero** poder crear notas de texto libre dentro de un viaje,
**para** apuntar cualquier información útil que necesite tener a mano.

**Prioridad:** Media

**Criterios de aceptación:**

- El usuario puede crear una nota desde la sección "Notas" del viaje.
- Cada nota tiene un título y un cuerpo de texto.
- El cuerpo permite texto multilínea.
- La nota se guarda con fecha y hora de creación.
- La nota queda asociada al viaje correspondiente.
- Se muestra confirmación al guardar la nota correctamente.

---

### HU-10.2: Listar notas del viaje

**Como** usuario,
**quiero** ver un listado de todas las notas de un viaje,
**para** acceder rápidamente a la información que he apuntado.

**Prioridad:** Media

**Criterios de aceptación:**

- Se muestra una lista con todas las notas del viaje.
- Cada elemento muestra el título y una vista previa del contenido (primeras líneas).
- Las notas se ordenan por fecha de creación (más recientes primero).
- Se muestra la fecha de última modificación de cada nota.
- Si no hay notas, se muestra un mensaje indicándolo con opción de crear una.

---

### HU-10.3: Editar nota existente

**Como** usuario,
**quiero** poder editar una nota que ya he creado,
**para** actualizar o completar la información que tengo apuntada.

**Prioridad:** Media

**Criterios de aceptación:**

- El usuario puede acceder a la edición pulsando sobre una nota.
- Se pueden modificar tanto el título como el cuerpo.
- Se actualiza automáticamente la fecha de última modificación.
- Los cambios se guardan correctamente.

---

### HU-10.4: Eliminar nota

**Como** usuario,
**quiero** poder eliminar una nota que ya no necesito,
**para** mantener organizada la sección de notas del viaje.

**Prioridad:** Media

**Criterios de aceptación:**

- El usuario puede eliminar una nota desde el listado o desde su vista de detalle.
- Se solicita confirmación antes de eliminar.
- La nota se elimina permanentemente tras la confirmación.
- El listado se actualiza tras la eliminación.

---

### HU-10.5: Categorizar notas

**Como** usuario,
**quiero** poder asignar una categoría o etiqueta a cada nota,
**para** organizar mejor la información y encontrarla más rápido.

**Prioridad:** Baja

**Criterios de aceptación:**

- Al crear o editar una nota, se puede seleccionar una categoría.
- Las categorías predefinidas incluyen:
  - 🍽️ Restaurantes y comida
  - 🗣️ Idioma y frases útiles
  - 📍 Direcciones y lugares
  - 🚨 Emergencias y seguridad
  - 💡 Consejos y tips
  - 📝 General
- Se puede filtrar el listado de notas por categoría.
- Cada nota muestra su categoría con el icono correspondiente.

---

### HU-10.6: Fijar nota como destacada

**Como** usuario,
**quiero** poder marcar una nota como destacada o fijada,
**para** que la información más importante aparezca siempre en primer lugar.

**Prioridad:** Baja

**Criterios de aceptación:**

- El usuario puede marcar/desmarcar una nota como destacada.
- Las notas destacadas aparecen siempre en la parte superior del listado.
- Se muestra un indicador visual (icono de pin o estrella) en las notas fijadas.
- No hay límite en el número de notas que se pueden fijar.

---

### HU-10.7: Añadir consejos predefinidos por destino

**Como** usuario,
**quiero** que la app me sugiera consejos útiles según el destino de mi viaje,
**para** tener información práctica sin tener que buscarla yo.

**Prioridad:** Baja

**Criterios de aceptación:**

- Al crear un viaje con un destino conocido, se ofrece la opción de añadir consejos sugeridos.
- Los consejos incluyen información como:
  - Moneda local y tipo de cambio aproximado.
  - Idioma oficial y frases básicas.
  - Zona horaria y diferencia con el origen.
  - Número de emergencias del país.
  - Tipo de enchufe y voltaje.
  - Propinas habituales.
- El usuario puede aceptar o rechazar cada consejo sugerido.
- Los consejos aceptados se añaden como notas al viaje.

---

### HU-10.8: Buscar dentro de las notas

**Como** usuario,
**quiero** poder buscar texto dentro de mis notas de un viaje,
**para** encontrar rápidamente una información concreta que apunté.

**Prioridad:** Baja

**Criterios de aceptación:**

- Existe un campo de búsqueda en la sección de notas.
- La búsqueda filtra notas cuyo título o contenido coincida con el texto buscado.
- Los resultados se muestran en tiempo real mientras se escribe.
- Se resalta el texto coincidente en los resultados.
- Si no hay coincidencias, se muestra un mensaje informativo.

---

### HU-10.9: Compartir nota

**Como** usuario,
**quiero** poder compartir una nota con otras personas,
**para** enviar información útil a mis compañeros de viaje.

**Prioridad:** Baja

**Criterios de aceptación:**

- El usuario puede compartir el contenido de una nota usando el sistema de compartir nativo del dispositivo.
- Se comparte el título y el cuerpo de la nota en formato texto.
- Se puede compartir por WhatsApp, email, Telegram u otras apps instaladas.
- La acción de compartir es accesible desde la vista de detalle de la nota.

---

## Modelo de Datos

### Nota (`Note`)

| Campo        | Tipo     | Obligatorio | Descripción                                    |
| ------------ | -------- | ----------- | ---------------------------------------------- |
| `id`         | string   | Sí          | Identificador único de la nota                 |
| `tripId`     | string   | Sí          | Referencia al viaje al que pertenece           |
| `title`      | string   | Sí          | Título de la nota                              |
| `content`    | string   | Sí          | Cuerpo de la nota (texto libre)                |
| `category`   | enum     | No          | Categoría de la nota                           |
| `isPinned`   | boolean  | Sí          | Si la nota está fijada como destacada          |
| `createdAt`  | datetime | Sí          | Fecha y hora de creación                       |
| `updatedAt`  | datetime | Sí          | Fecha y hora de última modificación            |

### Categorías de notas (`NoteCategory`)

| Valor            | Etiqueta               | Icono |
| ---------------- | ---------------------- | ----- |
| `food`           | Restaurantes y comida  | 🍽️    |
| `language`       | Idioma y frases útiles | 🗣️    |
| `directions`     | Direcciones y lugares  | 📍    |
| `emergency`      | Emergencias y seguridad| 🚨    |
| `tips`           | Consejos y tips        | 💡    |
| `general`        | General                | 📝    |

---

## Navegación

```
Viaje > Notas > Listado de notas
                  ├── Crear nota
                  ├── Detalle de nota
                  │     ├── Editar nota
                  │     ├── Compartir nota
                  │     └── Eliminar nota
                  ├── Filtrar por categoría
                  └── Buscar en notas
```

---

## Wireframe Conceptual

### Listado de Notas

```
┌─────────────────────────────────┐
│  🔍 Buscar en notas...         │
├─────────────────────────────────┤
│  Filtros: [Todas] [🍽️] [💡]... │
├─────────────────────────────────┤
│  📌 Números de emergencia       │
│  🚨 Emergencias · Hace 2 días  │
│  "112 - Emergencias general..."│
├─────────────────────────────────┤
│  📌 Frases útiles en portugués  │
│  🗣️ Idioma · Hace 3 días       │
│  "Obrigado - Gracias / Bom..." │
├─────────────────────────────────┤
│  Restaurante cerca del hotel    │
│  🍽️ Comida · Ayer               │
│  "Taberna da Rua das Flores..."│
├─────────────────────────────────┤
│  Consejos para el metro         │
│  💡 Tips · Hace 1 semana        │
│  "Comprar tarjeta Viva Viag..."│
├─────────────────────────────────┤
│         [+ Nueva nota]          │
└─────────────────────────────────┘
```

### Detalle / Edición de Nota

```
┌─────────────────────────────────┐
│  ← Notas          [📤] [🗑️]   │
├─────────────────────────────────┤
│  📌 Fijada                      │
│                                 │
│  Título:                        │
│  ┌─────────────────────────┐   │
│  │ Frases útiles en port.  │   │
│  └─────────────────────────┘   │
│                                 │
│  Categoría: [🗣️ Idioma    ▼]  │
│                                 │
│  Contenido:                     │
│  ┌─────────────────────────┐   │
│  │ Obrigado - Gracias      │   │
│  │ Bom dia - Buenos días   │   │
│  │ Quanto custa? - ¿Cuánto │   │
│  │ cuesta?                  │   │
│  │ A conta - La cuenta      │   │
│  │ Desculpe - Disculpe      │   │
│  │                          │   │
│  └─────────────────────────┘   │
│                                 │
│  Última edición: 15/02/2025    │
│                                 │
│        [💾 Guardar]             │
└─────────────────────────────────┘
```
