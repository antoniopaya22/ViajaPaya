# Design: f-011-auth-sso

## Por qué OTP por código y no "magic link" clicable

Un magic link requiere abrir el enlace del email y que el sistema operativo devuelva el control a la app vía deep link (`scheme://...`), lo cual es frágil probando con Expo Go (el link abriría Expo Go pero con el proyecto equivocado salvo configuración adicional de desarrollo). El código OTP de 6 dígitos lo genera el mismo `signInWithOtp`, se pega a mano en la app, y funciona igual en Expo Go, dev client o producción sin tocar deep links. Se revisita si en algún momento se prioriza login sin fricción de "un toque".

## Archivos

- `src/contexts/AuthProvider.tsx` — contexto: `session`, `user`, `loading`, `sendOtp(email)`, `verifyOtp(email, code)`, `signOut()`. Se suscribe a `supabase.auth.onAuthStateChange` y llama `getSession()` al montar.
- `src/components/ui/TextField.tsx` — input de texto themed (label, error, keyboardType, autoCapitalize), mismo lenguaje visual que el resto de `ui/`.
- `src/app/login.tsx` — pantalla de 2 pasos (email → código), fuera del grupo `(tabs)`.
- `src/app/_layout.tsx` — envuelve con `AuthProvider`; añade `AuthGate` (usa `useSegments`/`useRouter` de expo-router) que redirige según haya o no sesión.
- `src/app/(tabs)/settings.tsx` — fila "Cuenta" pasa a reflejar sesión real (email, botón cerrar sesión) en vez de estar hardcodeada.
- `src/app/(tabs)/index.tsx` — saludo usa el email de la sesión (prefijo antes de `@`) en vez de "Antonio" hardcodeado.

## Preparado para Google/Apple (no implementado)

`AuthProvider` expone `signInWithOtp`/`verifyOtp` como métodos separados de cualquier detalle de proveedor — añadir `signInWithGoogle()`/`signInWithApple()` más adelante es solo una función más en este mismo contexto, llamando a `supabase.auth.signInWithOAuth({ provider: 'google' | 'apple', ... })`, sin tocar el `AuthGate` ni las pantallas que consumen `useAuth()`. Requisito externo antes de activarlo: crear el OAuth client en Google Cloud Console / Apple Developer y pegar client id/secret en Supabase Dashboard → Authentication → Providers.

## Flujo de pantalla `login.tsx`

1. Paso `email`: `TextField` + `Button` "Enviar código" → `sendOtp(email)`. Éxito pasa a paso `code`. Error: `Text` inline en rojo (`colors.danger`) bajo el input.
2. Paso `code`: `TextField` numérico de 6 dígitos + `Button` "Verificar" → `verifyOtp(email, code)`. Botón "Volver" regresa a paso `email` sin perder el valor. Error igual que arriba.
3. Sesión creada → `AuthGate` redirige solo, `login.tsx` no navega manualmente.

## Prueba manual (no automatizable)

Recibir el código requiere acceso real a un email — se documenta como paso manual para el usuario en `progress/history.md`, no se simula.
