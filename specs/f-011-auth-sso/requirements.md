# Requirements: f-011-auth-sso

## Decisión de alcance

El backlog pedía SSO social (Google/Apple). Ambos requieren que el usuario cree sus propias credenciales OAuth (Google Cloud Console / Apple Developer Program) — no son creables por un agente. Decisión: implementar ahora **email + código OTP** (Supabase Auth nativo, sin configuración externa), dejando el modelo de datos y el `AuthProvider` listos para añadir Google/Apple como proveedores adicionales cuando el usuario aporte sus credenciales (ver `design.md`).

## EARS

1. CUANDO el usuario introduce un email válido y pulsa "Enviar código" EL SISTEMA DEBERÁ llamar a `supabase.auth.signInWithOtp` y mostrar el paso de introducir el código.
2. CUANDO el usuario introduce un código de 6 dígitos válido EL SISTEMA DEBERÁ verificar con `supabase.auth.verifyOtp` y, si es correcto, crear una sesión persistida.
3. CUANDO no existe sesión activa EL SISTEMA DEBERÁ redirigir cualquier ruta que no sea `/login` a `/login`.
4. CUANDO existe sesión activa EL SISTEMA DEBERÁ redirigir `/login` a la pantalla principal (tabs).
5. CUANDO la app arranca con una sesión previamente persistida EL SISTEMA DEBERÁ restaurarla sin pedir login de nuevo.
6. CUANDO el usuario pulsa "Cerrar sesión" en Ajustes EL SISTEMA DEBERÁ invalidar la sesión y redirigir a `/login`.
7. CUANDO el código OTP introducido es incorrecto o ha expirado EL SISTEMA DEBERÁ mostrar un error inline sin perder el email ya introducido.

## Fuera de alcance
Login con Apple (mismo bloqueo de credenciales externas que Google, ver `f-013-google-sso`). Perfil de usuario editable (nombre, avatar) — eso es `f-001` en adelante.

## Addendum — f-013-google-sso

El usuario recibió el email de OTP como link en vez de código (comportamiento por defecto de la plantilla de Supabase, no un bug) y pidió login con Google. EARS adicional:

8. CUANDO el usuario pulsa "Continuar con Google" EL SISTEMA DEBERÁ abrir el consentimiento de Google vía `supabase.auth.signInWithOAuth` + `expo-web-browser`, y al volver con éxito, crear sesión mediante `exchangeCodeForSession` (flujo PKCE).
9. CUANDO el usuario cancela el consentimiento de Google EL SISTEMA DEBERÁ volver a la pantalla de login sin mostrar error (cancelación explícita del usuario, no un fallo).
10. CUANDO Google no está configurado en Supabase todavía EL SISTEMA DEBERÁ mostrar el error que devuelva Supabase, sin romper el flujo de email OTP en la misma pantalla.
