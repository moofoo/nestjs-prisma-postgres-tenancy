-- PG_DUMP BOILERPLATE ---------------------------------
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- DROP AND CREATE DATABASE ---------------------------------
DROP DATABASE IF EXISTS app_db;

CREATE DATABASE app_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C.UTF-8';

ALTER DATABASE app_db OWNER TO postgres;

\connect app_db

-- CREATE FN SCHEMA ---------------------------------
CREATE SCHEMA IF NOT EXISTS fn;
ALTER SCHEMA fn OWNER TO postgres;


-- CREATE TENANT ROLE ---------------------------------
CREATE ROLE tenant WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'SCRAM-SHA-256$4096:E0Wq8zef+fUG5k++CVd7lg==$TpHflYTTvCNNIvHW2dkOe4UTb5V0yPw9su/kpoNxLy0=:BgselHsx/GYWjgaVxFQPE/NyUBzMM5O5WB168qFwYH8='; 
  -- c7b38884e5c959ac151e4f24320c7a34

GRANT USAGE ON SCHEMA public TO tenant;
GRANT USAGE ON SCHEMA fn TO tenant;


--  TABLES: TENANTS, USERS, PATIENTS ---------------------------------
create table if not exists public.tenants
(
    id bigserial primary key,
    display_name varchar,
    is_admin boolean default false
);

create table if not exists public.users
(
    id bigserial primary key,
    tenant_id bigint
        constraint users_tenants_id_fk
            references public.tenants
            on delete cascade,
    user_name varchar,
    password varchar
);

create table if not exists public.patients
(
    id bigserial primary key,    
    tenant_id bigint
        constraint patients_tenants_id_fk
            references public.tenants
            on delete cascade,
    first_name varchar,
    last_name varchar,
    dob date
);



-- GRANTS FOR TENANT ROLE ---------------------------------
grant delete, insert, select, update on public.tenants to tenant;
grant delete, insert, select, update on public.users to tenant;
grant delete, insert, select, update on public.patients to tenant;


-- ROW LEVEL SECURITY CHECK FUNCTION  ---------------------------------
create or replace function fn.tenant_data_rls_check(row_tenant_id bigint) returns boolean
    language plpgsql
as
$$

BEGIN

IF current_setting('tenancy.bypass')::text = '1' THEN
    return true;
end if;


IF current_setting('tenancy.tenant_id')::integer = row_tenant_id THEN
    return true;
end if;

return false;

END;
$$;

alter function fn.tenant_data_rls_check(bigint) owner to postgres;


-- ENABLE / DISABLE RLS ---------------------------------
create or replace procedure fn.enable_rls()
    language plpgsql
as
$$
DECLARE
   r record;
BEGIN
    FOR r in select * from pg_catalog.pg_policies
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;

END;
$$;

alter procedure fn.enable_rls() owner to postgres;

create or replace procedure fn.disable_rls()
    language plpgsql
as
$$
DECLARE
   r record;
BEGIN
    FOR r in select * from pg_catalog.pg_policies
    LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;

END;
$$;

alter procedure fn.enable_rls() owner to postgres;

-- POLICIES ---------------------------------
create policy tenancy_policy on public.tenants
    as permissive
    for all
    using (fn.tenant_data_rls_check(id) = true)
    with check (fn.tenant_data_rls_check(id) = true);

create policy tenancy_policy on public.users
    as permissive
    for all
    using (fn.tenant_data_rls_check(tenant_id) = true)
    with check (fn.tenant_data_rls_check(tenant_id) = true);

create policy tenancy_policy on public.patients
    as permissive
    for all
    using (fn.tenant_data_rls_check(tenant_id) = true)
    with check (fn.tenant_data_rls_check(tenant_id) = true);

-- ENABLE ROW LEVEL SECURITY ---------------------------------
CALL fn.enable_rls();