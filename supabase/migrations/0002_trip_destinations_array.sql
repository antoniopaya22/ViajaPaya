-- f-001-trip-crud (ajuste): destination pasa de texto único a lista de destinos.

alter table trips add column if not exists destinations text[] not null default '{}';

update trips
set destinations = array[destination]
where destination is not null and destination <> '' and destinations = '{}';

alter table trips drop column if exists destination;
