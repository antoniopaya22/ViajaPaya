# Design: f-010-supabase-setup

## Archivos

- `src/services/supabase.ts` — cliente único, `createClient(url, anonKey, { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })`.
- `supabase/migrations/0001_init.sql` — DDL versionado en el repo (fuente de verdad del esquema).
- `.env.example` ya tenía las claves; sin cambios ahí.

## Esquema

Tablas por-tipo de booking colapsadas en una sola `bookings` con `type` + `details jsonb`, en vez de una tabla por tipo (flight/train/hotel/activity): evita 4 tablas casi idénticas y encaja con que cada tipo tiene campos distintos (ver docs/domain-model.md). Columnas comunes tipadas, específicas en `details`.

```
trips(id uuid pk, user_id uuid not null, name text not null, destination text,
      start_date date, end_date date, cover_image text, budget_total numeric,
      created_at timestamptz default now(), updated_at timestamptz default now())

bookings(id uuid pk, trip_id uuid references trips on delete cascade, user_id uuid not null,
         type text check in ('flight','train','hotel','activity'),
         reference_code text, details jsonb not null default '{}',
         created_at timestamptz default now())

expenses(id uuid pk, trip_id uuid references trips on delete cascade, user_id uuid not null,
         amount numeric not null, currency text default 'EUR', category text,
         date date not null, note text, created_at timestamptz default now())

documents(id uuid pk, user_id uuid not null,
          trip_id uuid references trips on delete cascade null,
          booking_id uuid references bookings on delete set null null,
          type text not null, file_uri text not null, qr_data text, expiry_date date,
          created_at timestamptz default now())

itinerary_items(id uuid pk, trip_id uuid references trips on delete cascade, user_id uuid not null,
                date date not null, time time, title text not null,
                linked_booking_id uuid references bookings on delete set null,
                notes text, created_at timestamptz default now())
```

## RLS

`alter table X enable row level security;` + una policy `for all using (user_id = auth.uid()) with check (user_id = auth.uid())` por tabla. Sin política adicional para anon: select/insert/update/delete devuelven 0 filas / error de permiso por defecto.

## Aplicación de la migración

Sin Supabase CLI instalado. Conexión directa Postgres (`db.<ref>.supabase.co:5432`, password en `.env.local`) vía script Node puntual con `pg` (instalado solo en scratchpad, no en `package.json` del proyecto — es tooling de servidor, no pertenece al bundle de la app). El SQL en sí queda versionado en `supabase/migrations/0001_init.sql` para que cualquier agente futuro pueda re-aplicarlo (con `psql` o Supabase CLI cuando se instale) sin depender de ese script puntual.

## Verificación

Tras aplicar: query de prueba con la `anon key` (sin sesión) contra `trips` debe devolver 0 filas — confirma RLS activo.
