# Modelo de dominio

Entidades escritas de cero a partir de la descripción del producto (no se hereda del proyecto anterior). Se refinarán con detalle EARS en cada `specs/<feature>/requirements.md` según se implementen.

## User (Usuario)

Gestionado por Supabase Auth (SSO). No se modela como tabla propia más allá de lo que da `auth.users`; cada entidad de negocio (`Trip` y descendientes) lleva `user_id` referenciando a `auth.uid()`, con Row Level Security restringiendo cada fila a su propietario.

## Trip (Viaje) — raíz del agregado

Agrupa todo lo demás. Campos clave: `id`, `userId`, `name`, `destinations: string[]`, `startDate`, `endDate`, `coverImage?`. Sin presupuesto propio: el coste del viaje se calcula sumando sus `Expense` (ver más abajo), no se fija de antemano.

## Booking (Reserva)

Cualquier reserva ya hecha, asociada a un `Trip`. Subtipos por `type`:
- `flight` — aerolínea, número de vuelo, aeropuertos origen/destino, fecha/hora salida y llegada, terminal, puerta, localizador.
- `train` — compañía, estación origen/destino, fecha/hora salida y llegada, andén, asiento.
- `hotel` — nombre, dirección, fecha check-in/check-out, número de reserva.
- `activity` — nombre, ubicación, fecha/hora, duración, entrada/localizador.

Campos comunes: `id`, `tripId`, `type`, `referenceCode?`, `attachments: Document[]` (billetes/QR asociados).

## Expense (Gasto)

`id`, `tripId`, `amount`, `currency`, `description`, `tags: string[]`, `date`. Se registran a medida que se producen; el coste total del viaje es la suma de sus `Expense`, no una comparación contra un presupuesto fijado de antemano.

## Document (Documento)

Documento personal o de reserva, con adjunto (imagen/PDF) y datos para acceso rápido offline.
- Personal: `passport`, `id_card` (DNI), `visa`, `insurance`.
- De reserva: entradas/QR asociados a un `Booking` (relación vía `attachments`).

Campos: `id`, `tripId?` (null si es documento personal no ligado a un viaje concreto), `type`, `fileUri`, `qrData?`, `expiryDate?` (para pasaportes/visados).

## ItineraryItem (Itinerario)

Elemento del timeline día a día de un viaje: `id`, `tripId`, `date`, `time?`, `title`, `linkedBookingId?` (para mostrar reservas dentro del itinerario), `notes?`.

## Relaciones

`Trip` 1—N `Booking`, `Trip` 1—N `Expense`, `Trip` 1—N `ItineraryItem`, `Trip`/`Booking` 1—N `Document` (adjuntos). El itinerario se puede derivar automáticamente de las fechas de `Booking`, complementado con entradas manuales.
