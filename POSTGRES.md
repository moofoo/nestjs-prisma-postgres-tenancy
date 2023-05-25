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
);  db:
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

RLS function:

```sql
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
```

tenant_data_rls_check takes a single argument, the value of 'tenant_id' (or 'id' for the tenants table) for the queried/mutated row.

Looking at the function body, you'll see that first it checks if the session value 'tenancy.bypass' is equal to '1', and if so it returns true, allowing the operation.

Next, it compares the session value 'tenancy.tenant_id' with the tenant_id value for the row. If equal, it allows the operation, otherwise the operation fails.

###### Policies:

```sql
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
```

Note that 1_schema.sql enables these policies at the end of the script, so you don't need to do that yourself.

### [2_data.sql](db/2_data.sql)

This SQL file populates the database with the following test data:

## Tenants Test Data

<table border="1" style="border-collapse:collapse">
<tr><th>id</th><th>display_name</th><th>is_admin</th></tr>
<tr><td>1</td><td>user tenant 1</td><td>false</td></tr>
<tr><td>2</td><td>user tenant 2</td><td>false</td></tr>
<tr><td>3</td><td>user tenant 3</td><td>false</td></tr>
<tr><td>4</td><td>user tenant 4</td><td>false</td></tr>
<tr><td>5</td><td>user tenant 5</td><td>false</td></tr>
<tr><td>6</td><td>admin tenant</td><td>true</td></tr>
</table>

## Users Test Data

<table border="1" style="border-collapse:collapse">
<tr><th>id</th><th>tenant_id</th><th>user_name</th><th>password</th></tr>
<tr><td>1</td><td>1</td><td>t1 user1</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>2</td><td>1</td><td>t1 user2</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>3</td><td>2</td><td>t2 user1</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>4</td><td>2</td><td>t2 user2</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>5</td><td>3</td><td>t3 user1</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>6</td><td>3</td><td>t3 user2</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>7</td><td>4</td><td>t4 user1</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>8</td><td>4</td><td>t4 user2</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>9</td><td>5</td><td>t5 user1</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>10</td><td>5</td><td>t5 user2</td><td>$2b$10$gra37ECOljK.6udDxfwAOOTSyeQSbo9I0zS6l6NoMR1mbE.9T.jF2</td></tr>
<tr><td>11</td><td>6</td><td>t6 admin</td><td>$2b$10$YJ3paQsDvg7ykcUEB6kmQetsGcaRfPzTwvpOEQSc565epW.P82lMO</td></tr>
</table>

## Patients Test Data

<table border="1" style="border-collapse:collapse">
<tr><th>id</th><th>tenant_id</th><th>first_name</th><th>last_name</th><th>dob</th></tr>
<tr><td>1</td><td>1</td><td>John</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>2</td><td>1</td><td>Jim</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>3</td><td>1</td><td>Bob</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>4</td><td>1</td><td>Jerry</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>5</td><td>1</td><td>Fran</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>6</td><td>2</td><td>John</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>7</td><td>2</td><td>James</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>8</td><td>2</td><td>Josh</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>9</td><td>2</td><td>Harry</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>10</td><td>2</td><td>Mary</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>11</td><td>3</td><td>John</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>12</td><td>3</td><td>Jeoffrey</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>13</td><td>3</td><td>Max</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>14</td><td>3</td><td>Min</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>15</td><td>3</td><td>Patronius</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>16</td><td>4</td><td>John</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>17</td><td>4</td><td>Jane</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>18</td><td>4</td><td>Homer</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>19</td><td>4</td><td>Maggie</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>20</td><td>4</td><td>Bart</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>21</td><td>5</td><td>John</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>22</td><td>5</td><td>Walker</td><td>Doe</td><td>1992-05-13</td></tr>
<tr><td>23</td><td>5</td><td>Yeezy</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>24</td><td>5</td><td>Puff Daddy</td><td>Doe</td><td>1984-02-11</td></tr>
<tr><td>25</td><td>5</td><td>The Rock</td><td>Doe</td><td>1992-05-13</td></tr>
</table>
