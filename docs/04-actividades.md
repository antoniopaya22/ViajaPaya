# Épica 4: Gestión de Actividades

## Descripción

Permitir al usuario registrar y gestionar todas las actividades, excursiones, visitas y eventos planificados durante un viaje, con toda la información relevante y documentación asociada.

---

## Historia de Usuario 4.1: Ver listado de actividades de un viaje

**ID:** HU-4.1  
**Prioridad:** Alta

**Como** usuario,  
**quiero** ver un listado de todas las actividades planificadas en un viaje,  
**para** tener una visión general de todo lo que tengo programado hacer.

### Criterios de Aceptación

- [ ] Se muestra una lista de actividades asociadas al viaje seleccionado.
- [ ] Cada actividad muestra su nombre, fecha, hora y ubicación.
- [ ] Las actividades se ordenan cronológicamente por fecha y hora.
- [ ] Se muestra un indicador visual del tipo de actividad (excursión, visita, espectáculo, etc.).
- [ ] Si no hay actividades, se muestra un mensaje invitando a añadir la primera.
- [ ] Se puede distinguir visualmente entre actividades pasadas, actuales y futuras (durante el viaje).

---

## Historia de Usuario 4.2: Añadir una actividad a un viaje

**ID:** HU-4.2  
**Prioridad:** Alta

**Como** usuario,  
**quiero** añadir una actividad a mi viaje,  
**para** registrar todo lo que tengo planeado hacer en el destino.

### Criterios de Aceptación

- [ ] Se puede crear una nueva actividad desde la vista del viaje.
- [ ] Los campos disponibles son:
  - **Nombre de la actividad** (obligatorio) — ej: "Visita al Museo del Prado"
  - **Tipo de actividad** (obligatorio) — Excursión, Visita cultural, Espectáculo, Tour guiado, Aventura/Deporte, Gastronomía, Vida nocturna, Wellness/Spa, Otro
  - **Fecha** (obligatorio)
  - **Hora de inicio** (opcional)
  - **Hora de fin** (opcional)
  - **Duración estimada** (opcional) — se calcula automáticamente si hay hora inicio y fin
  - **Ubicación / Dirección** (opcional)
  - **Número de confirmación / Reserva** (opcional)
  - **Proveedor / Empresa** (opcional) — ej: "GetYourGuide", "Civitatis"
  - **Precio** (opcional)
  - **Moneda** (opcional)
  - **Estado de pago** (opcional) — Pagado, Pendiente de pago, Pago parcial
  - **Enlace web** (opcional) — URL a la web de la actividad o reserva online
  - **Punto de encuentro** (opcional) — para tours o excursiones con guía
  - **Notas** (opcional)
- [ ] Los campos obligatorios se validan antes de guardar.
- [ ] La fecha de la actividad debe estar dentro del rango de fechas del viaje (se muestra advertencia si no, pero se permite guardar).
- [ ] La actividad se guarda y aparece en el listado del viaje.

---

## Historia de Usuario 4.3: Ver detalle de una actividad

**ID:** HU-4.3  
**Prioridad:** Alta

**Como** usuario,  
**quiero** ver toda la información detallada de una actividad,  
**para** consultar rápidamente los datos cuando los necesite.

### Criterios de Aceptación

- [ ] Se accede al detalle pulsando sobre una actividad del listado.
- [ ] Se muestra toda la información registrada de la actividad.
- [ ] Se muestra el tipo de actividad con un icono representativo.
- [ ] Si tiene enlace web, se puede abrir directamente desde la app.
- [ ] Si tiene ubicación, se puede abrir en la aplicación de mapas del dispositivo.
- [ ] Si tiene punto de encuentro, se muestra de forma destacada.
- [ ] Se muestran los documentos adjuntos asociados (entradas, confirmaciones, etc.).
- [ ] Se ofrece la opción de editar o eliminar la actividad.

---

## Historia de Usuario 4.4: Editar una actividad

**ID:** HU-4.4  
**Prioridad:** Alta

**Como** usuario,  
**quiero** editar los datos de una actividad existente,  
**para** actualizar la información si cambian los planes o se confirman detalles.

### Criterios de Aceptación

- [ ] Se puede acceder a la edición desde el detalle de la actividad.
- [ ] Todos los campos son editables.
- [ ] Se mantienen las validaciones de los campos obligatorios.
- [ ] Los cambios se guardan correctamente y se reflejan en el listado y detalle.
- [ ] Se puede cancelar la edición sin guardar cambios.

---

## Historia de Usuario 4.5: Eliminar una actividad

**ID:** HU-4.5  
**Prioridad:** Alta

**Como** usuario,  
**quiero** eliminar una actividad de un viaje,  
**para** mantener mi planificación actualizada si cancelo algún plan.

### Criterios de Aceptación

- [ ] Se puede eliminar una actividad desde su vista de detalle.
- [ ] Se solicita confirmación antes de eliminar.
- [ ] Al eliminar, se eliminan también los documentos adjuntos asociados.
- [ ] La actividad desaparece del listado y del timeline del viaje.
- [ ] Se muestra confirmación de la eliminación exitosa.

---

## Historia de Usuario 4.6: Adjuntar documentos a una actividad

**ID:** HU-4.6  
**Prioridad:** Alta

**Como** usuario,  
**quiero** adjuntar documentos a una actividad (entradas, confirmaciones de reserva, etc.),  
**para** tener todo lo necesario accesible desde la propia actividad.

### Criterios de Aceptación

- [ ] Se pueden adjuntar documentos desde la vista de detalle de la actividad.
- [ ] Se admiten imágenes (JPG, PNG), PDF y capturas de pantalla.
- [ ] Se puede adjuntar desde la galería, la cámara o el explorador de archivos.
- [ ] Cada adjunto puede tener un nombre descriptivo — ej: "Entrada Museo del Prado", "QR Tour".
- [ ] Se pueden visualizar los adjuntos directamente en la app.
- [ ] Se pueden eliminar adjuntos individualmente.
- [ ] Se muestra una vista previa o miniatura de cada adjunto.

---

## Historia de Usuario 4.7: Ver QR o código de barras de una entrada

**ID:** HU-4.7  
**Prioridad:** Media

**Como** usuario,  
**quiero** poder ver a pantalla completa el QR o código de barras de una entrada,  
**para** mostrarlo cómodamente en el acceso a la actividad sin tener que buscar en el email.

### Criterios de Aceptación

- [ ] Desde el detalle de la actividad o desde el adjunto, se puede abrir el QR/código a pantalla completa.
- [ ] La pantalla se mantiene encendida (no se apaga) mientras se muestra el código.
- [ ] El brillo de la pantalla se sube al máximo automáticamente para facilitar el escaneo.
- [ ] Se puede hacer zoom con gestos de pinch.
- [ ] Se puede cerrar la vista de pantalla completa fácilmente.

---

## Historia de Usuario 4.8: Filtrar actividades por tipo

**ID:** HU-4.8  
**Prioridad:** Media

**Como** usuario,  
**quiero** filtrar las actividades por tipo (excursión, visita cultural, espectáculo, etc.),  
**para** encontrar rápidamente un tipo específico de actividad.

### Criterios de Aceptación

- [ ] Se pueden filtrar las actividades por su tipo desde el listado.
- [ ] Se pueden seleccionar varios tipos a la vez.
- [ ] Se muestra el número de actividades que coinciden con el filtro.
- [ ] Se puede limpiar el filtro para volver a ver todas las actividades.

---

## Historia de Usuario 4.9: Ver actividades en el mapa

**ID:** HU-4.9  
**Prioridad:** Baja

**Como** usuario,  
**quiero** ver mis actividades marcadas en un mapa,  
**para** visualizar dónde se ubican y planificar mejor mi día.

### Criterios de Aceptación

- [ ] Se muestra un mapa con marcadores en las ubicaciones de las actividades que tengan dirección registrada.
- [ ] Al pulsar un marcador, se muestra un resumen de la actividad (nombre, fecha, hora).
- [ ] Se pueden filtrar los marcadores por fecha para ver las actividades de un día concreto.
- [ ] Se puede navegar al detalle de la actividad desde el mapa.

---

## Historia de Usuario 4.10: Marcar actividad como completada

**ID:** HU-4.10  
**Prioridad:** Baja

**Como** usuario,  
**quiero** marcar una actividad como completada,  
**para** llevar un seguimiento de lo que ya he hecho durante el viaje.

### Criterios de Aceptación

- [ ] Se puede marcar/desmarcar una actividad como completada desde el listado o el detalle.
- [ ] Las actividades completadas se muestran con un indicador visual diferente (ej: tachado, check, opacidad).
- [ ] Se puede filtrar para ver solo actividades pendientes o solo completadas.
- [ ] El estado de completado se guarda y persiste entre sesiones.

---

## Historia de Usuario 4.11: Recibir recordatorio de una actividad

**ID:** HU-4.11  
**Prioridad:** Baja

**Como** usuario,  
**quiero** recibir un recordatorio antes de una actividad,  
**para** no olvidarme de ningún plan y llegar a tiempo.

### Criterios de Aceptación

- [ ] Se puede configurar un recordatorio al crear o editar una actividad.
- [ ] Las opciones de antelación son: 15 min, 30 min, 1 hora, 2 horas, 1 día antes.
- [ ] El recordatorio se muestra como una notificación local del dispositivo.
- [ ] La notificación incluye el nombre de la actividad, la hora y la ubicación.
- [ ] Se puede desactivar el recordatorio de una actividad individual.

---

## Notas Técnicas

- Los tipos de actividad deben ser extensibles para permitir futuras adiciones.
- La integración con mapas puede usar Google Maps o Apple Maps según la plataforma.
- La funcionalidad de QR a pantalla completa requiere permisos para controlar el brillo de la pantalla.
- Los recordatorios requieren permisos de notificaciones locales.
- Considerar la posibilidad de importar actividades desde plataformas como GetYourGuide, Civitatis o Viator en el futuro.