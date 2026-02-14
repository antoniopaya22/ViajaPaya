# Epic 5: Documentación Personal

## Descripción

El usuario puede almacenar de forma organizada sus documentos personales de identificación y viaje (DNI, pasaporte, visados, tarjetas de seguro, carnets, etc.) para tenerlos siempre accesibles desde la app. Esto incluye tanto los datos relevantes como fotografías/escaneos de los documentos originales.

---

## Historias de Usuario

### HU-5.1: Ver listado de documentos personales

**Como** usuario,
**quiero** ver un listado con todos mis documentos personales almacenados,
**para** acceder rápidamente a cualquiera de ellos cuando lo necesite.

**Prioridad:** Alta

**Criterios de aceptación:**

- Se muestra una lista con todos los documentos personales del usuario.
- Cada documento muestra su tipo (DNI, pasaporte, visado, etc.), un nombre identificativo y una miniatura de la imagen si existe.
- Se indica visualmente si un documento está caducado o próximo a caducar.
- Se puede filtrar por tipo de documento.
- Si no hay documentos, se muestra un estado vacío con un mensaje orientativo y un botón para añadir el primero.

---

### HU-5.2: Añadir documento de identidad (DNI / ID Card)

**Como** usuario,
**quiero** añadir mi DNI o documento de identidad nacional,
**para** tener siempre accesible una copia digital cuando viaje.

**Prioridad:** Alta

**Criterios de aceptación:**

- Se puede crear un documento de tipo "DNI / ID Card".
- Se pueden rellenar los campos: nombre completo, número de documento, fecha de expedición, fecha de caducidad, país emisor y nacionalidad.
- Se pueden adjuntar fotos del anverso y reverso del documento.
- Se puede hacer una foto directamente desde la cámara o seleccionar una imagen de la galería.
- Los datos se guardan correctamente y se muestran en el listado.

---

### HU-5.3: Añadir pasaporte

**Como** usuario,
**quiero** añadir mi pasaporte con todos sus datos relevantes,
**para** tener toda la información de mi pasaporte accesible durante el viaje.

**Prioridad:** Alta

**Criterios de aceptación:**

- Se puede crear un documento de tipo "Pasaporte".
- Se pueden rellenar los campos: nombre completo, número de pasaporte, fecha de expedición, fecha de caducidad, país emisor, nacionalidad y lugar de expedición.
- Se pueden adjuntar fotos de la página principal del pasaporte (página de datos biométricos).
- Se puede añadir más de una imagen (por ejemplo, páginas con sellos o visados).
- Los datos se guardan correctamente y se muestran en el listado.

---

### HU-5.4: Añadir visado

**Como** usuario,
**quiero** registrar un visado asociado a un país,
**para** tener accesible la información del visado cuando viaje a ese destino.

**Prioridad:** Media

**Criterios de aceptación:**

- Se puede crear un documento de tipo "Visado".
- Se pueden rellenar los campos: país de destino, tipo de visado (turista, trabajo, tránsito, estudiante, etc.), número de visado, fecha de expedición, fecha de caducidad, número de entradas permitidas (única, múltiple) y duración máxima de estancia.
- Se pueden adjuntar imágenes o PDFs del visado.
- Se puede vincular opcionalmente a un viaje concreto.

---

### HU-5.5: Añadir tarjeta sanitaria o seguro de viaje

**Como** usuario,
**quiero** almacenar los datos de mi tarjeta sanitaria europea o seguro de viaje,
**para** tener acceso rápido a esta información en caso de emergencia médica.

**Prioridad:** Media

**Criterios de aceptación:**

- Se puede crear un documento de tipo "Tarjeta Sanitaria" o "Seguro de Viaje".
- Para tarjeta sanitaria: nombre del titular, número de tarjeta, fecha de caducidad, país emisor.
- Para seguro de viaje: compañía aseguradora, número de póliza, teléfono de asistencia 24h, fecha de inicio y fin de cobertura, coberturas principales.
- Se pueden adjuntar fotos o PDFs de la tarjeta/póliza.
- Se puede vincular opcionalmente a un viaje concreto.
- El teléfono de asistencia se puede pulsar para llamar directamente.

---

### HU-5.6: Añadir carnet de conducir

**Como** usuario,
**quiero** almacenar mi carnet de conducir (nacional o internacional),
**para** tenerlo accesible si necesito alquilar un vehículo durante el viaje.

**Prioridad:** Baja

**Criterios de aceptación:**

- Se puede crear un documento de tipo "Carnet de Conducir".
- Se pueden rellenar los campos: nombre completo, número de carnet, categorías, fecha de expedición, fecha de caducidad, país emisor y si es internacional o nacional.
- Se pueden adjuntar fotos del anverso y reverso.
- Los datos se guardan correctamente.

---

### HU-5.7: Añadir documento genérico

**Como** usuario,
**quiero** poder añadir cualquier otro tipo de documento personal que no encaje en las categorías predefinidas,
**para** tener flexibilidad y guardar cualquier documentación relevante.

**Prioridad:** Media

**Criterios de aceptación:**

- Se puede crear un documento de tipo "Otro".
- Se puede asignar un nombre personalizado al documento (ej: "Certificado de vacunación", "Carnet de alberguista", "Permiso SCUBA", etc.).
- Se pueden rellenar campos genéricos: nombre del documento, número/referencia, fecha de expedición, fecha de caducidad (opcional) y notas.
- Se pueden adjuntar imágenes o PDFs.

---

### HU-5.8: Ver detalle de un documento personal

**Como** usuario,
**quiero** ver todos los datos e imágenes de un documento personal,
**para** poder consultar o enseñar la información cuando la necesite.

**Prioridad:** Alta

**Criterios de aceptación:**

- Se muestra toda la información almacenada del documento en una vista de detalle.
- Las imágenes se pueden ampliar a pantalla completa con zoom (pellizcar para hacer zoom).
- Se indica claramente el estado del documento: vigente, próximo a caducar (menos de 6 meses) o caducado.
- Se puede acceder a las acciones de editar y eliminar desde esta vista.

---

### HU-5.9: Editar documento personal

**Como** usuario,
**quiero** editar los datos o imágenes de un documento personal existente,
**para** mantener la información actualizada (por ejemplo, al renovar un pasaporte).

**Prioridad:** Alta

**Criterios de aceptación:**

- Se pueden modificar todos los campos del documento.
- Se pueden añadir, reemplazar o eliminar imágenes adjuntas.
- Los cambios se guardan al confirmar la edición.
- Se puede cancelar la edición sin guardar cambios.

---

### HU-5.10: Eliminar documento personal

**Como** usuario,
**quiero** eliminar un documento personal que ya no necesito,
**para** mantener mi listado limpio y organizado.

**Prioridad:** Media

**Criterios de aceptación:**

- Se solicita confirmación antes de eliminar.
- Al confirmar, se eliminan tanto los datos como las imágenes adjuntas.
- El documento desaparece del listado inmediatamente.

---

### HU-5.11: Alerta de caducidad de documentos

**Como** usuario,
**quiero** recibir una alerta cuando un documento esté próximo a caducar,
**para** poder renovarlo a tiempo antes de un viaje.

**Prioridad:** Baja

**Criterios de aceptación:**

- Se muestra un indicador visual (badge, icono) en los documentos que caducan en menos de 6 meses.
- Se muestra un indicador diferente para documentos ya caducados.
- En la pantalla principal o en el listado de documentos se muestra un aviso si hay documentos próximos a caducar.
- El umbral de alerta (6 meses) es un valor configurable a futuro.

---

### HU-5.12: Visualización rápida de documento (modo mostrar)

**Como** usuario,
**quiero** poder mostrar rápidamente la imagen de un documento a pantalla completa con brillo máximo,
**para** enseñarlo cómodamente en controles de seguridad o check-ins.

**Prioridad:** Media

**Criterios de aceptación:**

- Desde el detalle del documento existe un botón "Mostrar" o similar.
- Al pulsarlo, se muestra la imagen principal del documento a pantalla completa.
- El brillo de la pantalla se sube al máximo automáticamente.
- La pantalla no se apaga automáticamente mientras se está en este modo.
- Se puede salir del modo con un gesto o botón de cerrar.
- Al salir, el brillo vuelve al nivel anterior.

---

### HU-5.13: Vincular documento personal a un viaje

**Como** usuario,
**quiero** vincular un documento personal a uno o varios viajes,
**para** ver desde el viaje qué documentos necesito y acceder a ellos fácilmente.

**Prioridad:** Baja

**Criterios de aceptación:**

- Desde el detalle de un documento se pueden seleccionar los viajes a los que está vinculado.
- Desde el resumen de un viaje se puede ver la lista de documentos personales vinculados.
- Se puede desvincular un documento de un viaje sin eliminarlo.

---

## Modelo de datos sugerido

```
DocumentoPersonal {
  id: string
  tipo: 'dni' | 'pasaporte' | 'visado' | 'tarjeta_sanitaria' | 'seguro_viaje' | 'carnet_conducir' | 'otro'
  nombre: string                    // Nombre identificativo del documento
  nombreTitular: string
  numeroDocumento: string?
  paisEmisor: string?
  fechaExpedicion: Date?
  fechaCaducidad: Date?
  notas: string?
  
  // Campos específicos según tipo
  datosEspecificos: {
    // DNI / Pasaporte
    nacionalidad?: string
    lugarExpedicion?: string
    
    // Visado
    paisDestino?: string
    tipoVisado?: string
    entradasPermitidas?: 'unica' | 'multiple'
    duracionMaximaEstancia?: number  // en días
    
    // Seguro de viaje
    compania?: string
    telefonoAsistencia?: string
    coberturas?: string[]
    fechaInicioCobertura?: Date
    fechaFinCobertura?: Date
    
    // Carnet de conducir
    categorias?: string[]
    esInternacional?: boolean
    
    // Otro
    nombrePersonalizado?: string
  }
  
  imagenes: Imagen[]               // Fotos/escaneos del documento
  archivos: Archivo[]              // PDFs u otros archivos adjuntos
  viajesVinculados: string[]       // IDs de viajes vinculados
  
  creadoEn: Date
  actualizadoEn: Date
}
```

---

## Notas técnicas

- Las imágenes de documentos deben almacenarse de forma segura en el dispositivo.
- Considerar cifrado local para documentos sensibles (DNI, pasaporte).
- Las imágenes deben comprimirse para no ocupar demasiado espacio, pero manteniendo legibilidad.
- El modo "Mostrar" requiere permisos para controlar el brillo de pantalla y el bloqueo automático.
- Para el futuro, considerar OCR para rellenar automáticamente campos a partir de fotos del documento.

---

## Dependencias

- **Epic 1 (Gestión de Viajes):** Para vincular documentos a viajes.
- **Epic 6 (Documentos y Adjuntos):** Comparte lógica de gestión de archivos adjuntos.