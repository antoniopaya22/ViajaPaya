---
name: viajapaya-domain
description: Modelo de dominio específico de ViajaPayá (Trip, Booking, Expense, Document, ItineraryItem) y convenciones de datos de la app. Usar al trabajar en src/types/, src/services/, o al escribir specs/<id>/design.md que involucre entidades del dominio.
---

# Dominio ViajaPayá

Referencia rápida — la fuente completa está en [docs/domain-model.md](../../../docs/domain-model.md), léela si necesitas más detalle.

## Entidades

- **Trip** — raíz del agregado. `id, name, destination(s), startDate, endDate, coverImage?, budgetTotal?`.
- **Booking** — reserva ligada a un `Trip`, con `type: flight | train | hotel | activity` y campos específicos por tipo (ver domain-model.md). Todas comparten `id, tripId, type, referenceCode?, attachments: Document[]`.
- **Expense** — `id, tripId, amount, currency, category, date, note?`. Se compara contra `Trip.budgetTotal`.
- **Document** — documento personal (`passport, id_card, visa, insurance`, sin `tripId` obligatorio) o adjunto de una reserva (con `tripId`/`bookingId`). Campos: `id, tripId?, type, fileUri, qrData?, expiryDate?`.
- **ItineraryItem** — `id, tripId, date, time?, title, linkedBookingId?, notes?`. Se puede derivar de `Booking` + entradas manuales.

## Convenciones de dominio

- Todo dato pasa por `src/services/` (capa única de persistencia), nunca acceso directo a storage desde componentes — ver ADR [docs/decisions/0001-local-first-storage.md](../../../docs/decisions/0001-local-first-storage.md).
- El itinerario nunca duplica datos de `Booking`: se referencia (`linkedBookingId`), no se copia.
- Copy visible al usuario en español; nombres de campos/tipos en inglés (ver [docs/conventions.md](../../../docs/conventions.md)).
