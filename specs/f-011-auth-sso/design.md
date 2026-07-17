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

## Addendum — f-013-google-sso

`supabase.auth` se configura con `flowType: 'pkce'` (recomendado para móvil, evita el flujo implícito con tokens en el fragmento de URL). `signInWithGoogle()`:

1. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } })` → devuelve `data.url` (la URL de consentimiento de Google), no navega solo.
2. `WebBrowser.openAuthSessionAsync(data.url, redirectTo)` — abre un navegador in-app, y detecta cuándo la navegación llega a `redirectTo`, cerrando la ventana y devolviendo esa URL a JS (funciona igual en Expo Go, dev client o producción, sin depender del sistema de deep-link del SO).
3. De la URL de vuelta se extrae `?code=...` (PKCE) y se llama `supabase.auth.exchangeCodeForSession(code)`.
4. `redirectTo = makeRedirectUri()` de `expo-auth-session` — usa el `scheme` de `app.json` (`viajapaya://`) en builds nativos; en Expo Go genera una URI `exp://` dependiente de la IP local de desarrollo.

**Limitación conocida en Expo Go**: la URI de redirect en Expo Go cambia según la IP local, así que hay que añadirla también en Supabase → Authentication → URL Configuration → Redirect URLs cada vez que cambie de red, o probar el flujo completo con un dev client (`npx expo run:android`) en vez de Expo Go, que sí soporta el `viajapaya://` fijo. `viajapaya://*` ya cubre el caso del scheme fijo; el caso `exp://` de Expo Go es el que puede requerir añadirse puntualmente.

No se implementa Apple en esta pasada: mismo bloqueo (cuenta de Apple Developer del usuario), se añadiría con el mismo patrón (`signInWithApple`) cuando haya credenciales.
