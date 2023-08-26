# Database Overview

Here is the database service definition from docker-compose.yml:

```YAML
  db:
    <<: *defaults
    image: postgres:15.3-alpine3.17
    ports:
      - '5432:5432'
    volumes:
      - tenancy_example_db_data:/var/lib/postgresql/data
      - type: bind
        source: ./db
        target: /docker-entrypoint-initdb.d
    environment:
      POSTGRES_PASSWORD: 07f019e661d8ca48c47bdffd255b12fe
```

The bind mount maps the db directory on the host to the docker entrypoint directory.

The two SQL files in ./db (1_schema.sql and 2_data.sql) are executed when the container is created, creating the schema and populating it with test data.

### [1_schema.sql](db/1_schema.sql)

###### The tables:

```sql
create table if not exists public.tenants
(
    id bigserial primary key,
    display_name varchar
);

create table if not exists public.users
(
    id bigserial primary key,
    user_name varchar,
    password varchar,
    is_admin boolean default false
);

create table if not exists public.user_tenants
(
    id bigserial primary key,
    user_id bigint
        constraint users_user_id_fk
            references public.users
            on delete cascade,
    tenant_id bigint
        constraint users_tenants_id_fk
            references public.tenants
            on delete cascade
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

```

RLS-related functions:

```sql
create or replace function fn.session_user_is_tenant_member(tenant_ids bigint[]) returns boolean
    language plpgsql
as
$$
DECLARE
    user_is_member boolean;
BEGIN

SELECT count(*) > 0 INTO user_is_member FROM public.user_tenants WHERE user_id::bigint = current_setting('tenancy.user_id')::bigint AND tenant_ids::bigint[] && current_setting('tenancy.tenant_ids')::bigint[] LIMIT 1;

return user_is_member;

END;
$$;

alter function fn.session_user_is_tenant_member(bigint[]) owner to postgres;

-- ROW LEVEL SECURITY CHECK FUNCTIONS  ---------------------------------
create or replace function fn.tenant_data_rls_check(row_tenant_id bigint) returns boolean
    language plpgsql
as
$$

BEGIN

IF current_setting('tenancy.bypass')::text = '1' THEN
    return true;
end IF;

IF fn.session_user_is_tenant_member(ARRAY [row_tenant_id]) THEN
    return true;
end IF;

return false;

END;
$$;

alter function fn.tenant_data_rls_check(bigint) owner to postgres;

create or replace function fn.user_data_rls_check(row_user_id bigint) returns boolean
    language plpgsql
as
$$
DECLARE
    declare zero_id bigint default 0;
    tenant_ids bigint[];

BEGIN

-- allows login query to pass
IF current_setting('tenancy.bypass')::text = '1' THEN
    return true;
end if;

-- user's own data
IF current_setting('tenancy.user_id')::bigint = row_user_id::bigint THEN
    return true;
end if;

return false;

END;
$$;

alter function fn.user_data_rls_check(bigint) owner to postgres;
```

#

###### Policies:

```sql
create policy tenancy_policy on public.users
    as permissive
    for all
    using (fn.user_data_rls_check(id) = true)
    with check (fn.user_data_rls_check(id) = true);

create policy tenancy_policy on public.tenants
    as permissive
    for all
    using (fn.tenant_data_rls_check(id) = true)
    with check (fn.tenant_data_rls_check(id) = true);

create policy tenancy_policy on public.patients
    as permissive
    for all
    using (fn.tenant_data_rls_check(tenant_id) = true)
    with check (fn.tenant_data_rls_check(tenant_id) = true);
```

Note that 1_schema.sql enables these policies at the end of the script, so you don't need to do that yourself.

### [2_data.sql](db/2_data.sql)

This SQL file populates the database with the following test data:

## Tenants Test Data

<table border="1" style="border-collapse:collapse">
<tr><th>id</th><th>display_name</th></tr>
<tr><td>1</td><td>tenant 1</td></tr>
<tr><td>2</td><td>tenant 2</td></tr>
</table>

## Users Test Data

<table border="1" style="border-collapse:collapse">
<tr><th>id</th><th>user_name</th><th>password</th><th>is_admin</th></tr>
<tr><td>1</td><td>joe</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td><td>false</td></tr>
<tr><td>2</td><td>bruce</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td><td>false</td></tr>
<tr><td>3</td><td>jeremy</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td><td>false</td></tr>
<tr><td>4</td><td>yeezy</td><td>$2b$10$YJ3paQsDvg7ykcUEB6kmQetsGcaRfPzTwvpOEQSc565epW.P82lMO</td><td>true</td></tr>
</table>

## User Tenants Test Data

<table border="1" style="border-collapse:collapse">
<tr><th>id</th><th>user_id</th><th>tenant_id</th></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>3</td><td>1</td></tr>
<tr><td>4</td><td>3</td><td>2</td></tr>
<tr><td>5</td><td>4</td><td>1</td></tr>
<tr><td>6</td><td>4</td><td>2</td></tr>
</table>

## Patients Test Data

<table border="1" style="border-collapse:collapse">
<tr><th>id</th><th>tenant_id</th><th>first_name</th><th>last_name</th><th>dob</th></tr>
<tr><td>1</td><td>1</td><td>John</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>2</td><td>1</td><td>Jim</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>3</td><td>1</td><td>Bob</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>4</td><td>1</td><td>Jerry</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>5</td><td>1</td><td>Fran</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>6</td><td>2</td><td>John</td><td>Doe2</td><td>1992-05-13</td></tr>
<tr><td>7</td><td>2</td><td>James</td><td>Doe2</td><td>1984-02-11</td></tr>
<tr><td>8</td><td>2</td><td>Josh</td><td>Doe2</td><td>1984-02-11</td></tr>
<tr><td>9</td><td>2</td><td>Harry</td><td>Doe2</td><td>1984-02-11</td></tr>
<tr><td>10</td><td>2</td><td>Mary</td><td>Doe2</td><td>1992-05-13</td></tr>
</table>
