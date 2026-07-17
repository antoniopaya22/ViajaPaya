# ADR 0001: Almacenamiento local-first

## Estado

Aceptado.

## Contexto

ViajaPayá gestiona datos personales y sensibles (documentos de identidad, reservas) que el usuario necesita consultar sin depender de conexión a internet (uso típico: durante el viaje, en aeropuertos/fronteras). No hay, de momento, requisito de sincronización multi-dispositivo ni backend propio.

## Decisión

Persistencia local-first en el dispositivo, a través de una única capa de servicios (`src/services/`) que abstrae el mecanismo real de almacenamiento. Candidato inicial: `@react-native-async-storage/async-storage` para datos estructurados, `expo-file-system` para archivos adjuntos (imágenes/PDFs de documentos y reservas).

## Consecuencias

- Toda lectura/escritura de datos pasa por `src/services/`, nunca directamente desde componentes — así el mecanismo de almacenamiento se puede cambiar sin tocar la UI.
- No hay sincronización entre dispositivos ni backup remoto automático en la primera versión.

## Disparador para reconsiderar

Reabrir esta decisión si aparece alguno de estos casos:
- Necesidad de sincronizar viajes entre varios dispositivos del mismo usuario.
- El volumen de datos por viaje (adjuntos, documentos) hace inviable el rendimiento de AsyncStorage y conviene migrar a SQLite/WatermelonDB.
- Se añade cuenta de usuario / backend propio.
