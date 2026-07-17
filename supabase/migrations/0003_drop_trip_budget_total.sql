-- f-001-trip-crud (ajuste): el coste de un viaje se calcula sumando sus
-- gastos (f-006), no se fija un presupuesto de antemano al crear el viaje.

alter table trips drop column if exists budget_total;
