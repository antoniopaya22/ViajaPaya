# Epic 06: Adjuntos y Documentos de Viaje

## Descripción

Funcionalidad para adjuntar y gestionar documentos asociados a los distintos elementos del viaje (transportes, alojamientos, actividades). Incluye billetes, reservas, confirmaciones, QR codes y cualquier archivo relevante para el viaje.

---

## Historias de Usuario

### HU-06-01: Adjuntar documento a un transporte

**Como** usuario,
**quiero** adjuntar documentos (billetes, tarjetas de embarque, confirmaciones) a un transporte,
**para** tener toda la documentación del trayecto accesible desde la app.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede adjuntar uno o varios archivos a un transporte existente.
- Se admiten imágenes (JPG, PNG), PDF y capturas de pantalla.
- El archivo se almacena localmente en el dispositivo y se asocia al transporte.
- Se muestra una lista de documentos adjuntos en el detalle del transporte.
- Se muestra una miniatura o icono según el tipo de archivo.

---

### HU-06-02: Adjuntar documento a un alojamiento

**Como** usuario,
**quiero** adjuntar documentos (confirmación de reserva, voucher, instrucciones de check-in) a un alojamiento,
**para** tener la información de mi estancia accesible en cualquier momento.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede adjuntar uno o varios archivos a un alojamiento existente.
- Se admiten imágenes (JPG, PNG), PDF y capturas de pantalla.
- El archivo se almacena localmente y se asocia al alojamiento.
- Se muestra una lista de documentos adjuntos en el detalle del alojamiento.
- Se muestra una miniatura o icono según el tipo de archivo.

---

### HU-06-03: Adjuntar documento a una actividad

**Como** usuario,
**quiero** adjuntar documentos (entradas, reservas, confirmaciones) a una actividad,
**para** tener las entradas y reservas de mis planes accesibles rápidamente.

**Prioridad:** Alta

**Criterios de aceptación:**

- El usuario puede adjuntar uno o varios archivos a una actividad existente.
- Se admiten imágenes (JPG, PNG), PDF y capturas de pantalla.
- El archivo se almacena localmente y se asocia a la actividad.
- Se muestra una lista de documentos adjuntos en el detalle de la actividad.
- Se muestra una miniatura o icono según el tipo de archivo.

---

### HU-06-04: Visualizar documento adjunto

**Como** usuario,
**quiero** abrir y visualizar un documento adjunto a pantalla completa,
**para** poder enseñarlo fácilmente (por ejemplo, una tarjeta de embarque en el aeropuerto).

**Prioridad:** Alta

**Criterios de aceptación:**

- Al pulsar sobre un adjunto, se abre un visor a pantalla completa.
- Las imágenes se pueden ampliar con zoom (pinch-to-zoom).
- Los PDF se visualizan con un visor integrado o se abren con la app del sistema.
- El visor permite navegar entre varios adjuntos del mismo elemento con swipe.
- Se muestra un botón para cerrar el visor y volver al detalle.
- La visualización funciona sin conexión a internet.

---

### HU-06-05: Escanear código QR/barras desde un adjunto

**Como** usuario,
**quiero** que la app detecte y muestre códigos QR o de barras presentes en mis adjuntos,
**para** poder enseñar el QR directamente sin buscar el billete original.

**Prioridad:** Media

**Criterios de aceptación:**

- La app detecta automáticamente si un adjunto contiene un código QR o de barras.
- Se ofrece una opción de "Mostrar QR" que presenta el código a pantalla completa con brillo máximo.
- El código se muestra de forma clara y escaneable por lectores externos.
- La funcionalidad está disponible sin conexión a internet.

---

### HU-06-06: Capturar documento con la cámara

**Como** usuario,
**quiero** tomar una foto directamente desde la app para adjuntarla como documento,
**para** digitalizar billetes físicos, recibos o cualquier documento en papel.

**Prioridad:** Media

**Criterios de aceptación:**

- Se ofrece la opción de "Tomar foto" además de "Seleccionar de galería".
- La cámara se abre desde dentro de la app.
- La foto tomada se adjunta automáticamente al elemento correspondiente.
- Se solicitan los permisos de cámara de forma adecuada.
- Si el usuario deniega el permiso, se muestra un mensaje explicativo.

---

### HU-06-07: Eliminar documento adjunto

**Como** usuario,
**quiero** eliminar un documento adjunto que ya no necesito o que subí por error,
**para** mantener mis documentos organizados y sin archivos innecesarios.

**Prioridad:** Alta

**Criterios de aceptación:**

- Cada adjunto tiene una opción de eliminar (icono o swipe).
- Se pide confirmación antes de eliminar: "¿Seguro que quieres eliminar este documento?".
- Al confirmar, el archivo se elimina del almacenamiento local.
- La lista de adjuntos se actualiza inmediatamente.
- La eliminación es irreversible y se informa al usuario de ello.

---

### HU-06-08: Renombrar documento adjunto

**Como** usuario,
**quiero** cambiar el nombre de un documento adjunto,
**para** identificarlo fácilmente entre varios archivos similares.

**Prioridad:** Baja

**Criterios de aceptación:**

- El usuario puede editar el nombre del adjunto desde el detalle.
- El nombre por defecto se genera automáticamente (ej: "Billete_vuelo_Madrid_01Mar.pdf").
- Se valida que el nombre no esté vacío.
- El cambio de nombre se refleja inmediatamente en la lista de adjuntos.

---

### HU-06-09: Adjuntar documento general al viaje

**Como** usuario,
**quiero** adjuntar documentos generales al viaje que no pertenezcan a un elemento específico,
**para** tener un lugar donde guardar seguros de viaje, itinerarios generales u otros documentos globales.

**Prioridad:** Media

**Criterios de aceptación:**

- Existe una sección "Documentos generales" a nivel de viaje.
- El usuario puede adjuntar archivos que no están vinculados a ningún transporte, alojamiento o actividad.
- Se admiten los mismos tipos de archivo que en los demás adjuntos.
- Los documentos generales se muestran en el resumen del viaje.
- Se pueden categorizar opcionalmente (seguro, itinerario, otros).

---

### HU-06-10: Ver todos los documentos del viaje en un solo lugar

**Como** usuario,
**quiero** ver una lista consolidada de todos los documentos adjuntos de mi viaje,
**para** encontrar rápidamente cualquier documento sin tener que navegar por cada elemento.

**Prioridad:** Media

**Criterios de aceptación:**

- Existe una vista "Todos los documentos" accesible desde el viaje.
- La lista muestra todos los adjuntos agrupados por elemento (transportes, alojamientos, actividades, generales).
- Cada entrada muestra: nombre del archivo, tipo, elemento asociado y fecha de adjunción.
- Al pulsar un documento se abre el visor correspondiente.
- Se puede buscar/filtrar documentos por nombre o tipo.

---

### HU-06-11: Compartir documento adjunto

**Como** usuario,
**quiero** compartir un documento adjunto con otras personas o apps,
**para** enviar una reserva o billete a un compañero de viaje.

**Prioridad:** Baja

**Criterios de aceptación:**

- Cada adjunto tiene una opción de "Compartir".
- Se utiliza el sistema de compartir nativo del dispositivo (share sheet).
- El usuario puede enviar el archivo por WhatsApp, email, AirDrop, etc.
- Se comparte el archivo original sin pérdida de calidad.

---

## Notas técnicas

- **Almacenamiento:** Los archivos se almacenan en el sistema de archivos local del dispositivo usando `expo-file-system`.
- **Selección de archivos:** Usar `expo-image-picker` para imágenes y `expo-document-picker` para PDFs y otros archivos.
- **Cámara:** Usar `expo-camera` o `expo-image-picker` con opción de cámara.
- **Detección de QR:** Evaluar `expo-barcode-scanner` o librería de detección de QR en imágenes.
- **Visor de PDF:** Evaluar `react-native-pdf` o similar para renderizado inline.
- **Límites:** Establecer un tamaño máximo por archivo (ej: 25 MB) y un número máximo de adjuntos por elemento.
- **Formatos soportados:** JPG, JPEG, PNG, PDF, WEBP. Evaluar soporte para HEIC en iOS.
- **Nombres automáticos:** Generar nombres descriptivos basados en el tipo de elemento, destino y fecha.