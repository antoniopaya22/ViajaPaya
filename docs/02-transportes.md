# Épica 02: Gestión de Transportes

## Descripción

Permitir al usuario registrar y gestionar todos los transportes asociados a un viaje: vuelos, trenes, autobuses, ferries, alquiler de coches, traslados privados, etc. Cada transporte incluye información detallada y documentación adjunta.

---

## Historias de Usuario

### HU-02-01: Añadir un transporte a un viaje

**Como** usuario,
**quiero** añadir un transporte a mi viaje,
**para** tener registrado cómo me desplazo durante el viaje.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede seleccionar el tipo de transporte: vuelo, tren, autobús, ferry, coche de alquiler, traslado privado, taxi/VTC u otro.
- Se muestra un formulario adaptado según el tipo de transporte seleccionado.
- El transporte queda asociado al viaje actual.
- Se muestra confirmación de que el transporte se ha añadido correctamente.

---

### HU-02-02: Registrar datos de un vuelo

**Como** usuario,
**quiero** registrar los datos detallados de un vuelo,
**para** tener toda la información del vuelo accesible en un solo lugar.

**Prioridad:** Alta

**Criterios de aceptación:**

- El formulario incluye los campos: aerolínea, número de vuelo, aeropuerto de origen, aeropuerto de destino, fecha y hora de salida, fecha y hora de llegada, terminal de salida, terminal de llegada, puerta de embarque, número de asiento, clase (turista, business, primera), código de reserva/localizador.
- Los campos obligatorios son: aeropuerto de origen, aeropuerto de destino, fecha y hora de salida.
- Los demás campos son opcionales y pueden completarse más adelante.
- Se valida que la fecha de salida esté dentro del rango de fechas del viaje (con margen de ±1 día).

---

### HU-02-03: Registrar datos de un tren

**Como** usuario,
**quiero** registrar los datos de un trayecto en tren,
**para** tener organizada la información de mis desplazamientos en tren.

**Prioridad:** Alta

**Criterios de aceptación:**

- El formulario incluye los campos: compañía ferroviaria, número de tren, estación de origen, estación de destino, fecha y hora de salida, fecha y hora de llegada, número de vagón, número de asiento, clase, código de reserva/localizador.
- Los campos obligatorios son: estación de origen, estación de destino, fecha y hora de salida.
- Los demás campos son opcionales.

---

### HU-02-04: Registrar datos de un autobús

**Como** usuario,
**quiero** registrar los datos de un trayecto en autobús,
**para** tener la información de mis desplazamientos en bus organizada.

**Prioridad:** Media

**Criterios de aceptación:**

- El formulario incluye los campos: compañía, número de línea/servicio, parada/estación de origen, parada/estación de destino, fecha y hora de salida, fecha y hora de llegada, número de asiento, código de reserva.
- Los campos obligatorios son: origen, destino, fecha y hora de salida.

---

### HU-02-05: Registrar datos de un ferry

**Como** usuario,
**quiero** registrar los datos de un trayecto en ferry,
**para** tener la información del ferry accesible durante el viaje.

**Prioridad:** Baja

**Criterios de aceptación:**

- El formulario incluye los campos: compañía naviera, nombre del barco, puerto de origen, puerto de destino, fecha y hora de salida, fecha y hora de llegada, número de camarote (si aplica), tipo de billete (butaca, camarote, cubierta), matrícula del vehículo (si viaja con coche), código de reserva.
- Los campos obligatorios son: puerto de origen, puerto de destino, fecha y hora de salida.

---

### HU-02-06: Registrar datos de un coche de alquiler

**Como** usuario,
**quiero** registrar los datos de un alquiler de coche,
**para** tener toda la información de la reserva del vehículo en un solo sitio.

**Prioridad:** Media

**Criterios de aceptación:**

- El formulario incluye los campos: empresa de alquiler, número de reserva, lugar de recogida, lugar de devolución, fecha y hora de recogida, fecha y hora de devolución, categoría del vehículo, modelo (si se conoce), matrícula (para añadir después), número de póliza de seguro, teléfono de asistencia.
- Los campos obligatorios son: empresa, lugar de recogida, fecha de recogida, fecha de devolución.

---

### HU-02-07: Registrar un traslado privado o taxi

**Como** usuario,
**quiero** registrar los datos de un traslado privado o taxi reservado,
**para** tener la información del servicio disponible cuando lo necesite.

**Prioridad:** Baja

**Criterios de aceptación:**

- El formulario incluye los campos: empresa/servicio, nombre del conductor (si se conoce), teléfono de contacto, punto de recogida, punto de destino, fecha y hora de recogida, número de reserva, notas adicionales.
- Los campos obligatorios son: punto de recogida, punto de destino, fecha y hora.

---

### HU-02-08: Registrar un transporte genérico

**Como** usuario,
**quiero** poder registrar un tipo de transporte que no encaje en las categorías predefinidas,
**para** no quedarme sin poder registrar ningún desplazamiento.

**Prioridad:** Media

**Criterios de aceptación:**

- Existe la opción "Otro" en los tipos de transporte.
- El formulario incluye los campos: descripción del transporte, origen, destino, fecha y hora de salida, fecha y hora de llegada, código de reserva, notas.
- Los campos obligatorios son: descripción, origen, destino, fecha y hora de salida.

---

### HU-02-09: Adjuntar documentos a un transporte

**Como** usuario,
**quiero** adjuntar documentos (billetes, reservas, confirmaciones) a un transporte,
**para** tener toda la documentación asociada accesible desde la app.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede adjuntar archivos PDF, imágenes (JPG, PNG) y capturas de pantalla.
- Se permite adjuntar múltiples documentos por transporte.
- Cada documento adjunto puede tener un nombre/etiqueta descriptiva (ej: "Billete de ida", "Confirmación de reserva").
- Los documentos se pueden visualizar directamente desde la app.
- Se muestra una miniatura o icono del documento en la vista del transporte.
- El tamaño máximo por archivo es de 10 MB.

---

### HU-02-10: Adjuntar código QR o código de barras a un transporte

**Como** usuario,
**quiero** guardar el QR o código de barras de mi billete asociado a un transporte,
**para** poder enseñarlo rápidamente al embarcar sin buscar en el correo.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede adjuntar una imagen de QR o código de barras.
- Existe un botón de acceso rápido "Mostrar QR/Billete" en la vista del transporte.
- Al pulsar el botón, se muestra el QR/código a pantalla completa con brillo al máximo.
- Se puede adjuntar desde la galería o desde la cámara (escaneando).

---

### HU-02-11: Editar un transporte

**Como** usuario,
**quiero** editar los datos de un transporte ya registrado,
**para** actualizar la información si cambia algo (cambio de puerta, retraso, nuevo asiento, etc.).

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede acceder a la edición desde la vista de detalle del transporte.
- Todos los campos son editables.
- Se muestran los valores actuales pre-rellenados en el formulario.
- Se validan los datos igual que al crear.
- Se guarda confirmación del cambio.

---

### HU-02-12: Eliminar un transporte

**Como** usuario,
**quiero** eliminar un transporte de mi viaje,
**para** mantener la información del viaje actualizada si cancelo un desplazamiento.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede eliminar un transporte desde la vista de detalle o desde la lista.
- Se muestra un diálogo de confirmación antes de eliminar.
- Al eliminar el transporte, se eliminan también los documentos adjuntos asociados.
- El transporte desaparece del resumen y del timeline del viaje.

---

### HU-02-13: Ver lista de transportes de un viaje

**Como** usuario,
**quiero** ver todos los transportes de mi viaje en una lista,
**para** tener una visión general de todos mis desplazamientos.

**Prioridad:** Alta

**Criterios de aceptación:**

- La lista muestra todos los transportes ordenados cronológicamente por fecha de salida.
- Cada elemento de la lista muestra: icono del tipo de transporte, origen → destino, fecha y hora de salida, compañía/servicio (si existe).
- Se puede filtrar por tipo de transporte.
- Al pulsar un transporte se accede a su vista de detalle.

---

### HU-02-14: Ver detalle de un transporte

**Como** usuario,
**quiero** ver toda la información de un transporte en una vista de detalle,
**para** consultar rápidamente los datos que necesito.

**Prioridad:** Alta

**Criterios de aceptación:**

- Se muestran todos los datos registrados del transporte de forma clara y organizada.
- Se muestra el origen y destino de forma destacada.
- Se muestran las fechas y horas con formato legible.
- Se muestra la sección de documentos adjuntos con acceso directo.
- Se muestra un botón de acceso rápido al QR/billete (si tiene alguno adjunto).
- Se incluyen botones de editar y eliminar.

---

### HU-02-15: Añadir notas a un transporte

**Como** usuario,
**quiero** poder añadir notas libres a un transporte,
**para** apuntar información adicional relevante (ej: "El check-in online abre 48h antes", "Llevar impreso el billete").

**Prioridad:** Media

**Criterios de aceptación:**

- Existe un campo de texto libre en el formulario del transporte.
- Las notas se muestran en la vista de detalle.
- No hay límite práctico de caracteres.

---

### HU-02-16: Registrar coste de un transporte

**Como** usuario,
**quiero** registrar el precio que pagué por un transporte,
**para** poder llevar un control del presupuesto del viaje.

**Prioridad:** Media

**Criterios de aceptación:**

- El formulario incluye campos de precio y moneda.
- Se puede seleccionar la moneda de una lista (EUR, USD, GBP, etc.).
- El coste se refleja en el resumen de presupuesto del viaje (si se implementa la épica de presupuesto).
- El campo es opcional.

---

## Modelo de datos (referencia)

| Campo               | Tipo       | Obligatorio | Descripción                                   |
| ------------------- | ---------- | ----------- | --------------------------------------------- |
| id                  | UUID       | Sí          | Identificador único                           |
| tripId              | UUID       | Sí          | Viaje al que pertenece                        |
| type                | Enum       | Sí          | Tipo: flight, train, bus, ferry, car, transfer, other |
| origin              | String     | Sí          | Lugar de origen                               |
| destination         | String     | Sí          | Lugar de destino                              |
| departureDate       | DateTime   | Sí          | Fecha y hora de salida                        |
| arrivalDate         | DateTime   | No          | Fecha y hora de llegada                       |
| company             | String     | No          | Aerolínea, compañía, empresa                  |
| referenceCode       | String     | No          | Localizador / código de reserva               |
| serviceNumber       | String     | No          | Número de vuelo, tren, línea, etc.            |
| seatNumber          | String     | No          | Número de asiento                             |
| vehicleNumber       | String     | No          | Vagón, terminal, etc.                         |
| travelClass         | String     | No          | Clase (turista, business, etc.)               |
| gate                | String     | No          | Puerta de embarque                            |
| cost                | Decimal    | No          | Precio pagado                                 |
| currency            | String     | No          | Moneda del coste                              |
| notes               | String     | No          | Notas adicionales                             |
| attachments         | File[]     | No          | Documentos adjuntos                           |
| qrImage             | File       | No          | Imagen QR/código de barras del billete        |
| createdAt           | DateTime   | Sí          | Fecha de creación del registro                |
| updatedAt           | DateTime   | Sí          | Fecha de última modificación                  |

---

## Wireframes sugeridos

1. **Lista de transportes:** Lista vertical con cards, icono del tipo de transporte a la izquierda, origen → destino como título, fecha y compañía como subtítulo. FAB (+) para añadir.
2. **Selector de tipo:** Bottom sheet o pantalla con iconos grandes para cada tipo de transporte.
3. **Formulario de transporte:** Formulario scrollable con campos agrupados por secciones (Ruta, Horarios, Detalles, Documentos, Notas).
4. **Detalle de transporte:** Card principal con origen/destino y horarios, seguido de secciones colapsables para detalles, documentos y notas.
5. **Vista QR rápido:** Pantalla completa con fondo oscuro y el QR/billete centrado, brillo al máximo automáticamente.