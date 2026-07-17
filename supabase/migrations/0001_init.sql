-- f-010-supabase-setup: esquema inicial + RLS
-- Ver specs/f-010-supabase-setup/design.md para el razonamiento.

create extension if not exists "pgcrypto";

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  destination text,
  start_date date,
  end_date date,
  cover_image text,
  budget_total numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('flight', 'train', 'hotel', 'activity')),
  reference_code text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric not null,
  currency text not null default 'EUR',
  category text,
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  trip_id uuid references trips (id) on delete cascade,
  booking_id uuid references bookings (id) on delete set null,
  type text not null,
  file_uri text not null,
  qr_data text,
  expiry_date date,
  created_at timestamptz not null default now()
);

create table if not exists itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  time time,
  title text not null,
  linked_booking_id uuid references bookings (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

alter table trips enable row level security;
alter table bookings enable row level security;
alter table expenses enable row level security;
alter table documents enable row level security;
alter table itinerary_items enable row level security;

create policy "trips_owner" on trips for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "bookings_owner" on bookings for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "expenses_owner" on expenses for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "documents_owner" on documents for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "itinerary_items_owner" on itinerary_items for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
