-- ============================================================
--  MotoManager – SQL funkcije za čitanje podataka
--  Pokrenuti u Supabase SQL editoru (jednom)
-- ============================================================

-- ─── VOZILA ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_get_all_vehicles()
RETURNS SETOF vehicles
LANGUAGE sql STABLE AS $$
    SELECT * FROM vehicles ORDER BY registration;
$$;

CREATE OR REPLACE FUNCTION fn_get_vehicle_by_id(p_id bigint)
RETURNS SETOF vehicles
LANGUAGE sql STABLE AS $$
    SELECT * FROM vehicles WHERE id = p_id;
$$;

-- ─── KLIJENTI ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_get_all_clients()
RETURNS SETOF clients
LANGUAGE sql STABLE AS $$
    SELECT * FROM clients ORDER BY name;
$$;

CREATE OR REPLACE FUNCTION fn_get_client_by_id(p_id bigint)
RETURNS SETOF clients
LANGUAGE sql STABLE AS $$
    SELECT * FROM clients WHERE id = p_id;
$$;

-- ─── SERVISNI NALOZI ─────────────────────────────────────────

-- DDL: Pokrenuti ručno u DBeaver (direktna konekcija port 5432, Alt+X):
-- ALTER TABLE public.service_orders
--   ADD COLUMN IF NOT EXISTS date date NOT NULL DEFAULT CURRENT_DATE,
--   ADD COLUMN IF NOT EXISTS mileage int NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION fn_get_all_service_orders()
RETURNS SETOF service_orders
LANGUAGE sql STABLE AS $$
    SELECT * FROM service_orders ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION fn_get_service_order_by_id(p_id bigint)
RETURNS SETOF service_orders
LANGUAGE sql STABLE AS $$
    SELECT * FROM service_orders WHERE id = p_id;
$$;

-- ─── ŠIFARNICI ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_get_all_codebook_entries()
RETURNS SETOF codebook_entries
LANGUAGE sql STABLE AS $$
    SELECT * FROM codebook_entries ORDER BY entity, sort_order, name;
$$;

CREATE OR REPLACE FUNCTION fn_get_codebook_by_entity(p_entity text)
RETURNS SETOF codebook_entries
LANGUAGE sql STABLE AS $$
    SELECT * FROM codebook_entries
    WHERE entity = p_entity
    ORDER BY sort_order, name;
$$;

CREATE OR REPLACE FUNCTION fn_get_codebook_entry_by_id(p_id bigint)
RETURNS SETOF codebook_entries
LANGUAGE sql STABLE AS $$
    SELECT * FROM codebook_entries WHERE id = p_id;
$$;

-- ─── JEDINICE MERE ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_get_all_unit_of_measures()
RETURNS SETOF unit_of_measures
LANGUAGE sql STABLE AS $$
    SELECT * FROM unit_of_measures ORDER BY name;
$$;

CREATE OR REPLACE FUNCTION fn_get_unit_of_measure_by_id(p_id bigint)
RETURNS SETOF unit_of_measures
LANGUAGE sql STABLE AS $$
    SELECT * FROM unit_of_measures WHERE id = p_id;
$$;

-- ─── MATERIJALI ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_get_all_materials()
RETURNS SETOF materials
LANGUAGE sql STABLE AS $$
    SELECT * FROM materials ORDER BY name;
$$;

CREATE OR REPLACE FUNCTION fn_get_material_by_id(p_id bigint)
RETURNS SETOF materials
LANGUAGE sql STABLE AS $$
    SELECT * FROM materials WHERE id = p_id;
$$;

-- ─── SERVISNE OPERACIJE ──────────────────────────────────────

-- Pokrenuti jednom (DDL):
-- CREATE TABLE IF NOT EXISTS public.service_operations (
--     id bigserial PRIMARY KEY,
--     name varchar(128) NOT NULL,
--     work_hours numeric(6,2) NOT NULL DEFAULT 0,
--     is_active boolean NOT NULL DEFAULT true,
--     created_at timestamptz NOT NULL DEFAULT now(),
--     updated_at timestamptz NOT NULL DEFAULT now()
-- );

CREATE OR REPLACE FUNCTION fn_get_all_service_operations()
RETURNS SETOF service_operations
LANGUAGE sql STABLE AS $$
    SELECT * FROM service_operations ORDER BY name;
$$;

CREATE OR REPLACE FUNCTION fn_get_service_operation_by_id(p_id bigint)
RETURNS SETOF service_operations
LANGUAGE sql STABLE AS $$
    SELECT * FROM service_operations WHERE id = p_id;
$$;

-- ─── SERVISNE AKTIVNOSTI ─────────────────────────────────────

-- Pokrenuti jednom (DDL):
-- CREATE TABLE IF NOT EXISTS public.service_activities (
--     id bigserial PRIMARY KEY,
--     name varchar(128) NOT NULL,
--     is_active boolean NOT NULL DEFAULT true,
--     created_at timestamptz NOT NULL DEFAULT now(),
--     updated_at timestamptz NOT NULL DEFAULT now()
-- );
--
-- CREATE TABLE IF NOT EXISTS public.service_order_activities (
--     id bigserial PRIMARY KEY,
--     service_order_id bigint NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
--     service_activity_id bigint NOT NULL REFERENCES public.service_activities(id) ON DELETE RESTRICT,
--     UNIQUE(service_order_id, service_activity_id)
-- );

CREATE OR REPLACE FUNCTION fn_get_all_service_activities()
RETURNS SETOF service_activities
LANGUAGE sql STABLE AS $$
    SELECT * FROM service_activities ORDER BY name;
$$;

CREATE OR REPLACE FUNCTION fn_get_service_activity_by_id(p_id bigint)
RETURNS SETOF service_activities
LANGUAGE sql STABLE AS $$
    SELECT * FROM service_activities WHERE id = p_id;
$$;

CREATE OR REPLACE FUNCTION fn_get_activities_by_service_order(p_service_order_id bigint)
RETURNS SETOF service_activities
LANGUAGE sql STABLE AS $$
    SELECT sa.*
    FROM service_activities sa
    INNER JOIN service_order_activities soa ON soa.service_activity_id = sa.id
    WHERE soa.service_order_id = p_service_order_id
    ORDER BY sa.name;
$$;

-- ─── SERVISNE OPERACIJE NA NALOGU ────────────────────────────

-- DDL: Pokrenuti ručno u DBeaver (direktna konekcija port 5432, Alt+X):
-- CREATE TABLE IF NOT EXISTS public.service_order_operations (
--     id bigserial PRIMARY KEY,
--     service_order_id bigint NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
--     service_operation_id bigint NOT NULL REFERENCES public.service_operations(id) ON DELETE RESTRICT,
--     work_hours numeric(6,2) NOT NULL DEFAULT 0,
--     price_per_hour numeric(10,2) NOT NULL DEFAULT 0,
--     total_price numeric(10,2) NOT NULL DEFAULT 0
-- );

CREATE OR REPLACE FUNCTION fn_get_operations_by_service_order(p_service_order_id bigint)
RETURNS SETOF service_order_operations
LANGUAGE sql STABLE AS $$
    SELECT * FROM service_order_operations
    WHERE service_order_id = p_service_order_id
    ORDER BY id;
$$;
