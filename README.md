# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Arquitectura del Proyecto

Organización orientada a funcionalidades (feature-based) para escalar y localizar cambios fácilmente.

Estructura principal:

```
app/                 # Rutas (expo-router) y composición de pantallas
features/
   trips/
      hooks/           # Hooks de dominio (useTrips)
      components/      # Componentes UI específicos (TripListItem, ...)
      modals/          # Modales propios (CreateTripModal)
      screens/         # Pantallas internas (TripDetailScreen) *pendiente mover*
   bookings/          # (reservas) tarjetas y lógica específica
   places/            # (lugares) tarjetas y lógica específica
   navigation/        # UI de navegación (MenuDrawer)
components/          # Componentes genéricos compartidos (ThemedText, ThemedView, etc.)
services/            # Servicios (API/fetch/mock) tripService, citySearchService
types/               # Modelos de datos (Trip, Booking, City... barrel index)
utils/               # Utilidades puras (date, booking)
theme/               # Design tokens (spacing, radius, shadow, typography)
constants/           # Colores y constantes no lógicas
```

Principios:
1. Dominio primero: cada feature encapsula UI + lógica cercana al modelo.
2. Shared mínimo: sólo lo verdaderamente transversal pasa a components/, utils/, theme/.
3. Imports estables: usar alias `@/` y barrels (`types/index.ts`).
4. Reducir acoplamiento: hooks exponen contrato simple (estado + acciones) sin filtrar detalles internos.
5. Estilos consistentes: todos los paddings / radios / sombras via `theme/tokens`.
