# Epic 3: Gestión de Alojamientos

## Descripción

Permite al usuario registrar y gestionar todos los alojamientos contratados para un viaje: hoteles, apartamentos turísticos, hostales, Airbnb, campings, etc. Cada alojamiento incluye datos como fechas de check-in/check-out, dirección, contacto y documentación asociada.

---

## Historias de Usuario

### HU-3.1: Añadir alojamiento a un viaje

**Como** usuario,
**quiero** añadir un alojamiento a mi viaje,
**para** tener registrada toda la información de dónde me voy a hospedar.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede crear un nuevo alojamiento desde la vista de detalle del viaje.
- Se debe indicar obligatoriamente:
  - Nombre del alojamiento (ej: "Hotel Puerta del Sol", "Airbnb Centro").
  - Tipo de alojamiento (hotel, apartamento, hostal, camping, casa rural, otro).
  - Fecha y hora de check-in.
  - Fecha y hora de check-out.
- Campos opcionales:
  - Dirección completa.
  - Teléfono de contacto.
  - Email de contacto.
  - Número de reserva / código de confirmación.
  - Página web o enlace a la reserva.
  - Precio total.
  - Notas adicionales.
- Las fechas de check-in y check-out deben estar dentro del rango de fechas del viaje (o mostrar advertencia si no lo están).
- El alojamiento se guarda y aparece en la lista de alojamientos del viaje.

---

### HU-3.2: Listar alojamientos de un viaje

**Como** usuario,
**quiero** ver todos los alojamientos de mi viaje en una lista,
**para** tener una visión general de dónde me voy a alojar durante el viaje.

**Prioridad:** Alta

**Criterios de aceptación:**

- Se muestra una lista con todos los alojamientos asociados al viaje.
- Cada elemento de la lista muestra:
  - Nombre del alojamiento.
  - Tipo (con icono representativo).
  - Fechas de check-in y check-out.
  - Número de noches.
  - Dirección (si está disponible).
- La lista está ordenada cronológicamente por fecha de check-in.
- Si no hay alojamientos, se muestra un estado vacío con opción de añadir uno.
- Se muestra un indicador visual para diferenciar alojamientos pasados, actuales y futuros.

---

### HU-3.3: Ver detalle de un alojamiento

**Como** usuario,
**quiero** ver toda la información de un alojamiento,
**para** consultar los datos completos cuando los necesite (dirección, código de reserva, contacto, etc.).

**Prioridad:** Alta

**Criterios de aceptación:**

- Al pulsar sobre un alojamiento de la lista, se accede a su vista de detalle.
- Se muestran todos los datos introducidos por el usuario.
- Se muestra el número de noches calculado automáticamente.
- Si hay dirección, se ofrece la opción de abrir la ubicación en la app de mapas del dispositivo.
- Si hay teléfono, se ofrece la opción de llamar directamente.
- Si hay email, se ofrece la opción de enviar un correo.
- Si hay enlace web, se ofrece la opción de abrirlo en el navegador.
- Se muestra la lista de documentos adjuntos asociados al alojamiento.

---

### HU-3.4: Editar alojamiento

**Como** usuario,
**quiero** editar los datos de un alojamiento,
**para** corregir o actualizar la información si hay cambios en la reserva.

**Prioridad:** Alta

**Criterios de aceptación:**

- Desde la vista de detalle se puede acceder al modo edición.
- Todos los campos del alojamiento son editables.
- Se mantienen las mismas validaciones que al crear.
- Los cambios se guardan y se reflejan inmediatamente en la lista y el detalle.
- Se puede cancelar la edición sin guardar cambios.

---

### HU-3.5: Eliminar alojamiento

**Como** usuario,
**quiero** eliminar un alojamiento de mi viaje,
**para** mantener actualizada la información si cancelo una reserva.

**Prioridad:** Alta

**Criterios de aceptación:**

- Se puede eliminar un alojamiento desde la vista de detalle o desde la lista (mediante gesto de swipe o menú contextual).
- Se muestra un diálogo de confirmación antes de eliminar.
- Al eliminar el alojamiento, se eliminan también sus documentos adjuntos asociados.
- La lista de alojamientos se actualiza inmediatamente tras la eliminación.

---

### HU-3.6: Adjuntar documentos a un alojamiento

**Como** usuario,
**quiero** adjuntar documentos a un alojamiento (confirmación de reserva, factura, etc.),
**para** tener toda la documentación de mi estancia accesible desde la app.

**Prioridad:** Alta

**Criterios de aceptación:**

- Desde el detalle del alojamiento se pueden adjuntar documentos.
- Se admiten los siguientes tipos de adjuntos:
  - Imagen (desde galería o cámara).
  - Documento PDF.
  - Captura de pantalla.
- Cada adjunto tiene un nombre descriptivo editable (ej: "Confirmación Booking", "Factura hotel").
- Se pueden visualizar los adjuntos directamente en la app.
- Se pueden eliminar adjuntos individualmente.
- Se pueden adjuntar múltiples documentos a un mismo alojamiento.

---

### HU-3.7: Información de check-in y check-out

**Como** usuario,
**quiero** registrar datos específicos de check-in y check-out,
**para** tener a mano toda la información práctica de mi llegada y salida.

**Prioridad:** Media

**Criterios de aceptación:**

- Se puede indicar la hora exacta de check-in y check-out.
- Se puede añadir instrucciones de llegada (ej: "Recoger llaves en la recepción", "Código de la cerradura: 1234").
- Se puede registrar el número de habitación o apartamento.
- Se puede añadir el nombre de la persona de contacto en el alojamiento.
- Se puede especificar información de parking si aplica.

---

### HU-3.8: Tipos de alojamiento personalizados

**Como** usuario,
**quiero** poder seleccionar entre distintos tipos de alojamiento o crear uno personalizado,
**para** categorizar mis estancias de forma que se adapte a mi viaje.

**Prioridad:** Media

**Criterios de aceptación:**

- Se ofrecen tipos predefinidos: Hotel, Apartamento, Hostal, Camping, Casa rural, Airbnb, Resort, Crucero, Caravana/Autocaravana, Casa de amigos/familia, Otro.
- Cada tipo tiene un icono representativo.
- Si se selecciona "Otro", se permite introducir un nombre personalizado.
- El tipo de alojamiento se muestra en la lista y en el detalle.

---

### HU-3.9: Copiar datos del alojamiento

**Como** usuario,
**quiero** poder copiar rápidamente datos individuales del alojamiento (dirección, teléfono, código de reserva),
**para** pegarlos fácilmente en otras apps como GPS, email o WhatsApp.

**Prioridad:** Media

**Criterios de aceptación:**

- Cada campo de texto en la vista de detalle tiene una opción de copiar al portapapeles (pulsación larga o icono de copiar).
- Al copiar se muestra un feedback visual confirmando la acción (toast o snackbar).
- Se puede copiar: dirección, teléfono, email, número de reserva, enlace web y notas.

---

### HU-3.10: Vista de mapa con alojamientos

**Como** usuario,
**quiero** ver la ubicación de mis alojamientos en un mapa,
**para** tener una visión geográfica de dónde me alojo durante el viaje.

**Prioridad:** Baja

**Criterios de aceptación:**

- Se ofrece una vista de mapa que muestra los alojamientos que tienen dirección registrada.
- Cada alojamiento se representa con un marcador en el mapa.
- Al pulsar un marcador se muestra un resumen del alojamiento (nombre, fechas, tipo).
- Se puede navegar al detalle del alojamiento desde el marcador.

---

## Modelo de Datos (Referencia)

| Campo                 | Tipo       | Obligatorio | Descripción                                      |
| --------------------- | ---------- | ----------- | ------------------------------------------------ |
| `id`                  | `string`   | Sí          | Identificador único del alojamiento              |
| `tripId`              | `string`   | Sí          | ID del viaje asociado                            |
| `name`                | `string`   | Sí          | Nombre del alojamiento                           |
| `type`                | `enum`     | Sí          | Tipo de alojamiento                              |
| `customType`          | `string`   | No          | Nombre personalizado si type es "Otro"           |
| `checkInDate`         | `datetime` | Sí          | Fecha y hora de check-in                         |
| `checkOutDate`        | `datetime` | Sí          | Fecha y hora de check-out                        |
| `address`             | `string`   | No          | Dirección completa                               |
| `latitude`            | `number`   | No          | Latitud para ubicación en mapa                   |
| `longitude`           | `number`   | No          | Longitud para ubicación en mapa                  |
| `phone`               | `string`   | No          | Teléfono de contacto                             |
| `email`               | `string`   | No          | Email de contacto                                |
| `confirmationCode`    | `string`   | No          | Número de reserva o código de confirmación       |
| `website`             | `string`   | No          | URL de la reserva o web del alojamiento          |
| `totalPrice`          | `number`   | No          | Precio total de la estancia                      |
| `currency`            | `string`   | No          | Moneda del precio                                |
| `roomNumber`          | `string`   | No          | Número de habitación o apartamento               |
| `contactPerson`       | `string`   | No          | Nombre de la persona de contacto                 |
| `arrivalInstructions` | `string`   | No          | Instrucciones de llegada                         |
| `parkingInfo`         | `string`   | No          | Información de parking                           |
| `notes`               | `string`   | No          | Notas adicionales                                |
| `attachments`         | `array`    | No          | Lista de documentos adjuntos                     |
| `createdAt`           | `datetime` | Sí          | Fecha de creación del registro                   |
| `updatedAt`           | `datetime` | Sí          | Fecha de última actualización                    |

---

## Notas Técnicas

- Los alojamientos se almacenan localmente en el dispositivo.
- Las imágenes adjuntas se guardan en el sistema de archivos local y se referencian desde el modelo de datos.
- Para la funcionalidad de mapas, se puede utilizar la geocodificación de la dirección o permitir al usuario marcar la ubicación manualmente.
- El cálculo de noches se realiza automáticamente a partir de las fechas de check-in y check-out.
- La integración con apps nativas (mapas, teléfono, email) se realiza mediante deep links del sistema operativo.