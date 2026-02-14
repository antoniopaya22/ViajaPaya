# Epic 8: Presupuesto y Gastos

## Descripción

Funcionalidad que permite al usuario establecer un presupuesto para su viaje y llevar un control detallado de todos los gastos realizados, categorizados y con soporte para múltiples divisas.

---

## Historias de Usuario

### HU-8.1: Establecer presupuesto del viaje

**Como** usuario,
**quiero** establecer un presupuesto total para mi viaje,
**para** tener un límite de gasto definido y poder controlar mis finanzas durante el viaje.

**Prioridad:** Media

**Criterios de aceptación:**

- El usuario puede definir un presupuesto total en una divisa principal.
- El presupuesto se muestra de forma destacada en la vista de resumen del viaje.
- El usuario puede modificar el presupuesto en cualquier momento.
- Se muestra el porcentaje de presupuesto consumido de forma visual (barra de progreso o similar).
- Si no se establece presupuesto, la sección de gastos funciona igualmente sin límite.

---

### HU-8.2: Registrar un gasto

**Como** usuario,
**quiero** registrar un gasto asociado a mi viaje,
**para** llevar un control de todo lo que voy gastando.

**Prioridad:** Media

**Criterios de aceptación:**

- El usuario puede añadir un gasto con los siguientes campos:
  - Concepto / descripción (obligatorio).
  - Importe (obligatorio).
  - Divisa (obligatorio, por defecto la divisa principal del viaje).
  - Categoría (obligatorio): transporte, alojamiento, comida, actividades, compras, otros.
  - Fecha del gasto (obligatorio, por defecto la fecha actual).
  - Notas adicionales (opcional).
- El gasto se asocia automáticamente al viaje activo.
- Se valida que el importe sea un número positivo.
- El gasto aparece reflejado inmediatamente en el resumen de gastos.

---

### HU-8.3: Editar un gasto

**Como** usuario,
**quiero** editar los datos de un gasto ya registrado,
**para** corregir errores o actualizar información.

**Prioridad:** Media

**Criterios de aceptación:**

- El usuario puede acceder a la edición desde la lista de gastos o el detalle del gasto.
- Todos los campos del gasto son editables.
- Los cambios se reflejan inmediatamente en los totales y resúmenes.
- Se solicita confirmación antes de guardar los cambios.

---

### HU-8.4: Eliminar un gasto

**Como** usuario,
**quiero** eliminar un gasto registrado,
**para** corregir gastos añadidos por error.

**Prioridad:** Media

**Criterios de aceptación:**

- El usuario puede eliminar un gasto desde la lista o el detalle.
- Se solicita confirmación antes de eliminar ("¿Estás seguro de que quieres eliminar este gasto?").
- El gasto eliminado se descuenta de todos los totales y resúmenes.
- La eliminación es permanente.

---

### HU-8.5: Ver lista de gastos

**Como** usuario,
**quiero** ver una lista con todos los gastos de mi viaje,
**para** tener una visión completa de en qué he gastado el dinero.

**Prioridad:** Media

**Criterios de aceptación:**

- La lista muestra todos los gastos ordenados por fecha (más recientes primero).
- Cada elemento de la lista muestra: concepto, importe, categoría (con icono/color) y fecha.
- El usuario puede filtrar los gastos por categoría.
- El usuario puede ordenar los gastos por fecha o por importe.
- En la parte superior de la lista se muestra el total gastado.

---

### HU-8.6: Ver resumen de gastos por categoría

**Como** usuario,
**quiero** ver un desglose de mis gastos agrupados por categoría,
**para** saber en qué áreas estoy gastando más dinero.

**Prioridad:** Baja

**Criterios de aceptación:**

- Se muestra un resumen visual (gráfico circular o de barras) con el gasto por categoría.
- Cada categoría muestra el importe total y el porcentaje sobre el total.
- Las categorías se diferencian por colores e iconos.
- Se puede acceder al detalle de gastos de cada categoría al tocar sobre ella.

---

### HU-8.7: Soporte para múltiples divisas

**Como** usuario,
**quiero** poder registrar gastos en diferentes divisas,
**para** gestionar correctamente los gastos cuando viajo a países con distinta moneda.

**Prioridad:** Baja

**Criterios de aceptación:**

- Al registrar un gasto, el usuario puede seleccionar la divisa de una lista predefinida (EUR, USD, GBP, etc.).
- El usuario define una divisa principal para el viaje.
- Los gastos en divisas distintas a la principal se convierten automáticamente usando un tipo de cambio.
- El usuario puede introducir manualmente el tipo de cambio si lo desea.
- Los totales y resúmenes se muestran siempre en la divisa principal del viaje.
- Se muestra tanto el importe original como el convertido en el detalle del gasto.

---

### HU-8.8: Adjuntar ticket o factura a un gasto

**Como** usuario,
**quiero** adjuntar una foto del ticket o factura a un gasto,
**para** tener un justificante visual de cada gasto.

**Prioridad:** Baja

**Criterios de aceptación:**

- El usuario puede adjuntar una imagen desde la cámara o la galería del dispositivo.
- Se permite adjuntar hasta 3 imágenes por gasto.
- Las imágenes se pueden visualizar en pantalla completa.
- El usuario puede eliminar una imagen adjunta.
- Se soportan formatos JPG y PNG.

---

### HU-8.9: Alerta de presupuesto

**Como** usuario,
**quiero** recibir una alerta visual cuando me acerque al límite de mi presupuesto,
**para** ser consciente de que estoy gastando más de lo previsto.

**Prioridad:** Baja

**Criterios de aceptación:**

- Cuando el gasto acumulado alcanza el 80% del presupuesto, se muestra un indicador de advertencia (amarillo/naranja).
- Cuando el gasto acumulado supera el 100% del presupuesto, se muestra un indicador de alerta (rojo).
- La barra de progreso del presupuesto cambia de color según el nivel de gasto:
  - Verde: 0-79%.
  - Amarillo/Naranja: 80-99%.
  - Rojo: 100% o más.
- El usuario puede desactivar las alertas si lo desea.

---

### HU-8.10: Gasto diario medio

**Como** usuario,
**quiero** ver cuál es mi gasto diario medio durante el viaje,
**para** poder ajustar mi ritmo de gasto en los días restantes.

**Prioridad:** Baja

**Criterios de aceptación:**

- Se calcula el gasto medio diario dividiendo el total gastado entre el número de días transcurridos.
- Se muestra una estimación del gasto total proyectado al final del viaje basándose en el ritmo actual.
- Si hay presupuesto definido, se muestra cuánto debería gastar por día para mantenerse dentro del presupuesto.
- Estos datos se muestran en la vista de resumen de presupuesto.

---

## Categorías de gastos predefinidas

| Categoría     | Icono sugerido | Color sugerido |
| ------------- | -------------- | -------------- |
| Transporte    | ✈️ / 🚗        | Azul           |
| Alojamiento   | 🏨             | Morado         |
| Comida        | 🍽️             | Naranja        |
| Actividades   | 🎭             | Verde          |
| Compras       | 🛍️             | Rosa           |
| Salud         | ⚕️             | Rojo           |
| Comunicación  | 📱             | Cyan           |
| Otros         | 📌             | Gris           |

---

## Notas técnicas

- Los importes deben almacenarse con dos decimales como mínimo.
- Las conversiones de divisa se realizan de forma local (sin necesidad de API externa), permitiendo al usuario introducir el tipo de cambio manualmente.
- Las imágenes de tickets deben comprimirse antes de almacenarse para optimizar el espacio.
- Considerar exportación del resumen de gastos a CSV o PDF en futuras iteraciones.