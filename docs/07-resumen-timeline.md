# Epic 7: Resumen y Timeline del Viaje

## Descripción

Proporcionar al usuario una vista consolidada de todo su viaje, incluyendo una línea temporal (timeline) que muestre de forma cronológica todos los eventos: transportes, alojamientos, actividades y cualquier otro elemento planificado. Esta vista es el corazón de la aplicación, ya que permite al usuario tener una visión global y detallada de su viaje en todo momento.

---

## Historias de Usuario

### HU-7.1: Ver resumen general del viaje

**Como** usuario,
**quiero** ver un resumen general de mi viaje,
**para** tener una visión rápida de toda la información clave sin tener que navegar por cada sección.

**Criterios de aceptación:**

- El resumen muestra el nombre del viaje, destino y fechas (inicio y fin).
- Se muestra el número total de días del viaje.
- Se presenta un contador resumen de elementos: número de transportes, alojamientos y actividades registrados.
- Se muestra el gasto total acumulado vs. el presupuesto estimado (si existe).
- Se indica el estado del viaje (próximo, en curso, finalizado).
- Si faltan datos importantes (ej: noches sin alojamiento, días sin transporte de ida/vuelta), se muestra un aviso o indicador visual.

**Prioridad:** Alta
**Estimación:** 5 puntos

---

### HU-7.2: Ver timeline cronológico del viaje

**Como** usuario,
**quiero** ver una línea temporal (timeline) con todos los eventos de mi viaje ordenados cronológicamente,
**para** saber exactamente qué ocurre cada día y a cada hora.

**Criterios de aceptación:**

- El timeline muestra todos los transportes, alojamientos y actividades del viaje en orden cronológico.
- Cada evento en el timeline muestra: tipo (icono diferenciado), nombre, fecha, hora y ubicación.
- Los eventos se agrupan por día, mostrando la fecha como separador.
- Se distingue visualmente entre tipos de evento (transporte, alojamiento, actividad) mediante iconos y colores.
- El timeline es scrollable y permite navegar entre los diferentes días.
- Si un evento no tiene hora asignada, se muestra al final del día correspondiente con una indicación de "hora por definir".

**Prioridad:** Alta
**Estimación:** 8 puntos

---

### HU-7.3: Navegar al detalle desde el timeline

**Como** usuario,
**quiero** poder pulsar sobre cualquier evento del timeline para ir a su detalle,
**para** consultar o editar la información completa de ese transporte, alojamiento o actividad.

**Criterios de aceptación:**

- Al pulsar un evento del timeline, se navega a la pantalla de detalle correspondiente.
- Desde el detalle se puede volver al timeline manteniendo la posición de scroll.
- La navegación es fluida y no pierde el contexto del día que se estaba consultando.

**Prioridad:** Alta
**Estimación:** 3 puntos

---

### HU-7.4: Ver vista de día específico

**Como** usuario,
**quiero** poder seleccionar un día concreto del viaje y ver todo lo que tengo planificado para ese día,
**para** organizar mi jornada de forma detallada.

**Criterios de aceptación:**

- Se puede acceder a la vista de un día concreto desde el timeline o desde un selector de fechas.
- La vista del día muestra todos los eventos ordenados por hora.
- Se muestran los detalles relevantes de cada evento: nombre, hora, dirección, notas.
- Se muestra el alojamiento correspondiente a esa noche (check-in/check-out si aplica).
- Si no hay eventos para ese día, se muestra un mensaje indicándolo con opción de añadir un evento.
- Se puede navegar entre días con gestos de swipe o botones de día anterior/siguiente.

**Prioridad:** Media
**Estimación:** 5 puntos

---

### HU-7.5: Ver calendario visual del viaje

**Como** usuario,
**quiero** ver un calendario visual que marque los días del viaje y los eventos asociados,
**para** tener una perspectiva mensual/semanal de mi planificación.

**Criterios de aceptación:**

- Se muestra un calendario con los días del viaje destacados visualmente.
- Los días que tienen eventos muestran indicadores (puntos de colores según el tipo de evento).
- Al pulsar un día del calendario, se muestra el listado de eventos de ese día.
- Se diferencia visualmente entre días con muchos eventos y días libres.
- Los días fuera del rango del viaje aparecen atenuados o deshabilitados.

**Prioridad:** Media
**Estimación:** 5 puntos

---

### HU-7.6: Ver tarjetas resumen por categoría

**Como** usuario,
**quiero** ver tarjetas resumen de cada categoría (transportes, alojamientos, actividades) en la pantalla principal del viaje,
**para** acceder rápidamente a la información más relevante de cada sección.

**Criterios de aceptación:**

- Se muestra una tarjeta para transportes con el próximo transporte o el resumen de transportes registrados.
- Se muestra una tarjeta para alojamientos con el alojamiento actual o próximo.
- Se muestra una tarjeta para actividades con la próxima actividad planificada.
- Cada tarjeta permite acceder al listado completo de esa categoría.
- Si una categoría no tiene elementos, la tarjeta muestra un CTA (call to action) para añadir el primer elemento.
- Las tarjetas muestran información contextual según el estado del viaje (próximo vs. en curso).

**Prioridad:** Alta
**Estimación:** 5 puntos

---

### HU-7.7: Ver indicador de día actual en viaje en curso

**Como** usuario,
**quiero** que cuando mi viaje esté en curso se destaque el día actual en el timeline,
**para** saber rápidamente qué tengo planificado para hoy.

**Criterios de aceptación:**

- Cuando el viaje está en curso, al abrir el timeline se posiciona automáticamente en el día actual.
- El día actual se destaca visualmente con un indicador especial (borde, color de fondo, etiqueta "Hoy").
- Se muestra una cuenta atrás o indicador del tipo "Día 5 de 20" para situar al usuario.
- Los eventos pasados del viaje en curso aparecen con un estilo atenuado o tachado.
- El próximo evento del día se destaca para que sea visible de un vistazo.

**Prioridad:** Media
**Estimación:** 3 puntos

---

### HU-7.8: Detectar conflictos y huecos en la planificación

**Como** usuario,
**quiero** que la aplicación detecte conflictos de horarios y huecos en mi planificación,
**para** asegurarme de que mi viaje está bien organizado y no tengo solapamientos.

**Criterios de aceptación:**

- Se detectan y señalan solapamientos de horarios entre eventos (ej: dos actividades a la misma hora).
- Se detectan noches sin alojamiento asignado dentro del rango del viaje.
- Se detectan huecos de transporte (ej: el usuario está en Madrid pero su siguiente alojamiento es en Barcelona sin transporte registrado).
- Los conflictos se muestran con un icono de advertencia en el timeline y en el resumen.
- Al pulsar un conflicto, se muestra un detalle explicando el problema y se ofrecen opciones para resolverlo (ej: "Añadir transporte", "Cambiar hora").
- Las advertencias son informativas, no bloquean al usuario.

**Prioridad:** Baja
**Estimación:** 8 puntos

---

### HU-7.9: Ver cuenta atrás para el viaje

**Como** usuario,
**quiero** ver una cuenta atrás que indique cuántos días faltan para mi próximo viaje,
**para** sentir la emoción y tener presente cuándo empieza.

**Criterios de aceptación:**

- En la pantalla principal se muestra "Faltan X días" para el próximo viaje.
- Si el viaje está en curso, se muestra "Día X de Y" y "Quedan Z días".
- Si el viaje ya finalizó, se muestra "Hace X días" o "Finalizado".
- La cuenta atrás se actualiza automáticamente cada día.

**Prioridad:** Baja
**Estimación:** 2 puntos

---

### HU-7.10: Compartir resumen del viaje

**Como** usuario,
**quiero** poder compartir el resumen o itinerario de mi viaje,
**para** que mis acompañantes o familiares conozcan mi planificación.

**Criterios de aceptación:**

- Se puede generar un resumen en formato texto plano o imagen con el itinerario del viaje.
- El resumen incluye: destino, fechas, transportes principales, alojamientos y actividades con fechas y horas.
- Se utiliza el mecanismo nativo de compartir del dispositivo (share sheet).
- El usuario puede elegir qué secciones incluir en el resumen compartido.
- No se comparten documentos adjuntos ni información sensible (datos de pasaporte, etc.) por defecto.

**Prioridad:** Baja
**Estimación:** 5 puntos

---

## Notas Técnicas

- El timeline es la pantalla más compleja de la aplicación, ya que agrega datos de múltiples fuentes (transportes, alojamientos, actividades).
- Considerar el uso de `SectionList` o `FlashList` de React Native para optimizar el renderizado de listas largas con separadores de día.
- La detección de conflictos (HU-7.8) requiere lógica de comparación de rangos de fecha/hora entre todos los eventos.
- Para el calendario visual (HU-7.5), evaluar librerías como `react-native-calendars`.
- El resumen y las tarjetas deben ser reactivos y actualizarse cuando se añadan, editen o eliminen eventos en cualquier categoría.
- La funcionalidad de compartir (HU-7.10) puede usar `expo-sharing` o la API nativa de `Share` de React Native.

---

## Wireframe Conceptual

```
┌─────────────────────────────────┐
│  🌍 Madrid - España             │
│  1 mar - 20 mar (20 días)       │
│  ⏳ Faltan 15 días              │
├─────────────────────────────────┤
│  📊 Resumen                     │
│  ✈️ 2 transportes               │
│  🏨 1 alojamiento               │
│  🎯 5 actividades               │
│  💰 450€ / 800€ presupuesto     │
├─────────────────────────────────┤
│  📅 Timeline                    │
│                                 │
│  ── 1 de marzo ──               │
│  ✈️ 08:00 Vuelo BCN → MAD       │
│  🏨 14:00 Check-in Hotel Centro │
│                                 │
│  ── 2 de marzo ──               │
│  🎯 10:00 Visita Museo Prado   │
│  🎯 16:00 Tour por el Retiro   │
│                                 │
│  ── 3 de marzo ──               │
│  ⚠️ Sin eventos planificados    │
│     [+ Añadir evento]           │
│                                 │
│  ...                            │
│                                 │
│  ── 20 de marzo ──              │
│  🏨 11:00 Check-out Hotel       │
│  ✈️ 18:00 Vuelo MAD → BCN       │
└─────────────────────────────────┘
```
