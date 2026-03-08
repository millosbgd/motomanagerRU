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
