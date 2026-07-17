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
Login con Google/Apple (bloqueado por credenciales externas, ver decisión arriba). Perfil de usuario editable (nombre, avatar) — eso es `f-001` en adelante.
