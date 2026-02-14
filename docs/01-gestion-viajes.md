# Epic 1: Gestión de Viajes

Épica principal que cubre la creación, edición, visualización y eliminación de viajes.

---

## HU-1.1: Crear un viaje

**Como** usuario,
**quiero** crear un nuevo viaje indicando destino, fecha de inicio y fecha de fin,
**para** poder organizar toda la información relacionada con ese viaje.

### Criterios de aceptación

- El usuario puede introducir un nombre para el viaje (ej: "Escapada a Madrid").
- El usuario puede indicar el destino del viaje.
- El usuario debe seleccionar una fecha de inicio y una fecha de fin.
- La fecha de fin no puede ser anterior a la fecha de inicio.
- El usuario puede añadir opcionalmente una imagen de portada para el viaje.
- El usuario puede añadir opcionalmente una descripción o notas generales.
- Al crear el viaje, se muestra en la lista de viajes del usuario.

### Prioridad: Alta

---

## HU-1.2: Listar mis viajes

**Como** usuario,
**quiero** ver una lista de todos mis viajes,
**para** poder acceder rápidamente a cualquiera de ellos.

### Criterios de aceptación

- Los viajes se muestran en una lista o cuadrícula con su nombre, destino, fechas e imagen de portada.
- Los viajes se organizan en tres categorías: **Próximos**, **En curso** y **Pasados**.
- Los viajes próximos se ordenan por fecha de inicio ascendente (el más cercano primero).
- Los viajes pasados se ordenan por fecha de fin descendente (el más reciente primero).
- Si no hay viajes, se muestra un estado vacío con un botón para crear el primer viaje.
- Se muestra una cuenta atrás en días para los viajes próximos (ej: "Faltan 15 días").

### Prioridad: Alta

---

## HU-1.3: Ver detalle de un viaje

**Como** usuario,
**quiero** acceder al detalle de un viaje,
**para** ver un resumen completo con transportes, alojamientos, actividades y documentos asociados.

### Criterios de aceptación

- Se muestra el nombre del viaje, destino, fechas y duración en días.
- Se muestra un resumen con el número de transportes, alojamientos y actividades registrados.
- Se puede navegar a las secciones de transportes, alojamientos, actividades, documentos, presupuesto y checklist.
- Se muestra una vista tipo timeline o agenda con los eventos del viaje ordenados cronológicamente.

### Prioridad: Alta

---

## HU-1.4: Editar un viaje

**Como** usuario,
**quiero** poder editar los datos de un viaje existente,
**para** corregir o actualizar la información si cambian mis planes.

### Criterios de aceptación

- El usuario puede modificar el nombre, destino, fechas, imagen de portada y descripción.
- Se validan las mismas reglas que al crear (fecha de fin posterior a fecha de inicio).
- Si se modifican las fechas, se muestra un aviso si hay transportes, alojamientos o actividades fuera del nuevo rango de fechas.
- Los cambios se guardan y se reflejan inmediatamente en la lista de viajes.

### Prioridad: Alta

---

## HU-1.5: Eliminar un viaje

**Como** usuario,
**quiero** poder eliminar un viaje,
**para** mantener mi lista de viajes limpia y organizada.

### Criterios de aceptación

- Se solicita confirmación antes de eliminar el viaje.
- El mensaje de confirmación indica que se eliminarán también todos los transportes, alojamientos, actividades, documentos y gastos asociados.
- Al confirmar, el viaje y toda su información asociada se eliminan permanentemente.
- El usuario regresa a la lista de viajes tras la eliminación.

### Prioridad: Alta

---

## HU-1.6: Duplicar un viaje

**Como** usuario,
**quiero** poder duplicar un viaje existente,
**para** reutilizar la estructura si vuelvo al mismo destino o hago un viaje similar.

### Criterios de aceptación

- Se crea una copia del viaje con el nombre "(Nombre del viaje) - Copia".
- Se copian los datos generales del viaje pero las fechas quedan vacías para que el usuario las defina.
- Opcionalmente, el usuario puede elegir si quiere duplicar también las actividades, alojamientos y transportes (sin documentos adjuntos).
- El viaje duplicado aparece en la lista de viajes.

### Prioridad: Baja

---

## HU-1.7: Compartir resumen del viaje

**Como** usuario,
**quiero** poder compartir un resumen de mi viaje,
**para** enviárselo a mis acompañantes de viaje o familiares.

### Criterios de aceptación

- El usuario puede generar un resumen en texto con los datos principales del viaje (destino, fechas, transportes, alojamientos y actividades).
- Se utiliza el sistema nativo de compartir del dispositivo (Share Sheet).
- El resumen incluye las fechas y horarios de cada elemento del viaje de forma legible.

### Prioridad: Baja