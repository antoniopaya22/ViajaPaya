# Epic 9: Checklist / Lista de Equipaje

## Descripción

Funcionalidad que permite al usuario crear y gestionar listas de cosas que llevar al viaje (equipaje, documentos, medicamentos, etc.), con plantillas predefinidas y la posibilidad de personalización.

---

## Historia de Usuario 9.1: Ver checklist del viaje

**ID:** US-9.1  
**Prioridad:** Media  

**Como** viajero,  
**quiero** ver una checklist de equipaje asociada a mi viaje,  
**para** asegurarme de que no olvido nada importante antes de salir.

### Criterios de aceptación

- Desde la vista del viaje se puede acceder a la sección "Equipaje" o "Checklist".
- Se muestra una lista con todos los ítems añadidos, organizados por categorías.
- Cada ítem muestra su nombre y un checkbox para marcarlo como preparado/empacado.
- Se muestra un indicador de progreso (por ejemplo "12 de 20 ítems listos").
- Si la checklist está vacía, se muestra un mensaje invitando a añadir ítems o usar una plantilla.

---

## Historia de Usuario 9.2: Añadir ítem a la checklist

**ID:** US-9.2  
**Prioridad:** Media  

**Como** viajero,  
**quiero** añadir ítems a mi checklist de equipaje,  
**para** personalizar la lista según las necesidades de mi viaje.

### Criterios de aceptación

- Existe un botón o campo para añadir un nuevo ítem.
- Se puede introducir el nombre del ítem.
- Se puede asignar una categoría al ítem (ropa, tecnología, documentos, higiene, medicamentos, otros).
- Se puede indicar la cantidad (por defecto 1).
- El ítem se añade a la checklist y aparece en la categoría correspondiente.
- Se valida que el nombre del ítem no esté vacío.

---

## Historia de Usuario 9.3: Marcar ítem como preparado

**ID:** US-9.3  
**Prioridad:** Media  

**Como** viajero,  
**quiero** marcar ítems de la checklist como preparados,  
**para** llevar un control visual de lo que ya he empacado.

### Criterios de aceptación

- Se puede tocar el checkbox de un ítem para marcarlo como preparado.
- El ítem marcado cambia visualmente (tachado, color diferente, etc.).
- Se puede desmarcar un ítem ya marcado.
- El indicador de progreso se actualiza automáticamente.
- El estado se persiste entre sesiones.

---

## Historia de Usuario 9.4: Editar ítem de la checklist

**ID:** US-9.4  
**Prioridad:** Baja  

**Como** viajero,  
**quiero** editar un ítem existente de la checklist,  
**para** corregir su nombre, cantidad o categoría.

### Criterios de aceptación

- Se puede acceder a la edición de un ítem (toque largo o botón de editar).
- Se puede modificar el nombre, la categoría y la cantidad.
- Los cambios se guardan y reflejan inmediatamente en la lista.
- Se valida que el nombre no quede vacío.

---

## Historia de Usuario 9.5: Eliminar ítem de la checklist

**ID:** US-9.5  
**Prioridad:** Media  

**Como** viajero,  
**quiero** eliminar ítems de la checklist,  
**para** quitar elementos que ya no necesito llevar.

### Criterios de aceptación

- Se puede eliminar un ítem mediante swipe o botón de eliminar.
- Se solicita confirmación antes de eliminar.
- El ítem desaparece de la lista y el progreso se recalcula.
- La eliminación es definitiva.

---

## Historia de Usuario 9.6: Usar plantilla predefinida

**ID:** US-9.6  
**Prioridad:** Media  

**Como** viajero,  
**quiero** cargar una plantilla predefinida de checklist,  
**para** tener una base de ítems comunes sin tener que añadirlos uno a uno.

### Criterios de aceptación

- Al crear o editar la checklist, se ofrece la opción de cargar una plantilla.
- Existen plantillas predefinidas según tipo de viaje:
  - **Viaje de playa**: bañador, protector solar, toalla, gafas de sol, etc.
  - **Viaje de montaña/aventura**: botas, mochila, cantimplora, linterna, etc.
  - **Viaje de negocios**: traje, portátil, cargador, documentos, etc.
  - **Viaje genérico**: ropa básica, higiene, documentos, tecnología, etc.
- Al seleccionar una plantilla, se añaden los ítems a la checklist actual.
- Si ya hay ítems en la checklist, se pregunta si se quiere reemplazar o añadir.
- Los ítems cargados desde plantilla se pueden editar y eliminar como cualquier otro.

---

## Historia de Usuario 9.7: Organizar checklist por categorías

**ID:** US-9.7  
**Prioridad:** Baja  

**Como** viajero,  
**quiero** ver mi checklist organizada por categorías,  
**para** encontrar rápidamente lo que busco y tener una vista ordenada.

### Criterios de aceptación

- Los ítems se agrupan visualmente por categoría.
- Cada categoría tiene un encabezado con su nombre e icono representativo.
- Las categorías se pueden colapsar/expandir.
- Se muestra el progreso por categoría (ej: "3 de 5" en Ropa).
- Las categorías disponibles son al menos: Ropa, Tecnología, Documentos, Higiene, Medicamentos, Accesorios, Otros.

---

## Historia de Usuario 9.8: Resetear checklist

**ID:** US-9.8  
**Prioridad:** Baja  

**Como** viajero,  
**quiero** poder resetear el estado de toda la checklist (desmarcar todos los ítems),  
**para** reutilizar la misma lista en la preparación de otro viaje o rehacerla desde cero.

### Criterios de aceptación

- Existe una opción de "Resetear checklist" accesible desde un menú de opciones.
- Se solicita confirmación antes de resetear.
- Al confirmar, todos los ítems se desmarcan (vuelven a estado "pendiente").
- Los ítems no se eliminan, solo se desmarca su estado.
- El progreso vuelve a "0 de N".

---

## Historia de Usuario 9.9: Crear categoría personalizada

**ID:** US-9.9  
**Prioridad:** Baja  

**Como** viajero,  
**quiero** crear mis propias categorías para la checklist,  
**para** organizar los ítems según mis necesidades específicas.

### Criterios de aceptación

- Al añadir o editar un ítem, se puede seleccionar "Nueva categoría".
- Se introduce el nombre de la categoría personalizada.
- La nueva categoría aparece en la lista de categorías disponibles.
- Se puede reutilizar la categoría personalizada para otros ítems del mismo viaje.
- Se valida que no se repita el nombre de una categoría existente.

---

## Notas técnicas

- La checklist es local a cada viaje; cada viaje tiene su propia lista.
- Las plantillas predefinidas se almacenan como datos estáticos en la aplicación.
- Considerar la posibilidad futura de que el usuario cree sus propias plantillas a partir de una checklist existente.
- El progreso de la checklist podría mostrarse también en la vista resumen del viaje.
- Evaluar la posibilidad de añadir recordatorios vinculados a la checklist (ej: "Recuerda empacar, tu viaje es mañana").