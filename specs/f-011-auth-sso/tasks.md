# Tasks: f-011-auth-sso

- [x] `src/contexts/AuthProvider.tsx` (session/user/loading, sendOtp, verifyOtp, signOut)
- [x] `src/components/ui/TextField.tsx`
- [x] `src/app/login.tsx` (paso email + paso código)
- [x] `AuthGate` en `src/app/_layout.tsx` (redirección según sesión)
- [x] `src/app/(tabs)/settings.tsx`: sesión real + cerrar sesión
- [x] `src/app/(tabs)/index.tsx`: saludo dinámico con email de sesión
- [x] `npx tsc --noEmit` y `npm test` sin errores
- [x] Verificar en `expo start --web`: pantalla login renderiza, sin sesión redirige a `/login`
- [x] Marcar `f-011` `done` en `feature_list.json`, actualizar `progress/`

## f-013-google-sso

- [x] `flowType: 'pkce'` en `src/services/supabase.ts`
- [x] `signInWithGoogle` en `src/contexts/AuthProvider.tsx` (`signInWithOAuth` + `expo-web-browser` + `exchangeCodeForSession`)
- [x] Botón "Continuar con Google" en `src/app/login.tsx`
- [x] `npx tsc --noEmit` y `npm test` sin errores
- [x] Instrucciones de configuración externa (Google Cloud + Supabase Dashboard) entregadas al usuario

## Fixes de infraestructura encontrados durante la implementación

- [x] `metro.config.js` con `resolver.unstable_enablePackageExports = false` — `@supabase/functions-js` no resolvía bajo la resolución estricta de "exports" por defecto de Metro.
- [x] `app.json`: `web.output` de `static` a `single` — el modo `static` ejecuta los layouts en un pre-render Node/SSR donde `window` no existe, y el storage de sesión de Supabase (basado en `window`) fallaba ahí. `single` (SPA) evita el SSR por completo, correcto para una app mobile-first sin necesidad de SEO.
