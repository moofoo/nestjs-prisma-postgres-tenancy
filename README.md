# nestjs-prisma-postgres-tenancy

Full Stack Multi-Tenant Example App in NestJS using Prisma and PostgreSQL. Demonstrates Request Scoped, Durable Request Scoped, and AsyncLocalStorage based implementations

### [Postgres Database Info](POSTGRES.md)

### [Nginx Reverse-Proxy Info](NGINX.md)

### [Authentication and Session Info](AUTH.md)

#

## Branches

#### branch **[main](https://github.com/moofoo/nestjs-prisma-postgres-tenancy)** - Request scoped providers

#### branch **[durable](https://github.com/moofoo/nestjs-prisma-postgres-tenancy/tree/durable)** - Durable request scoped providers (scoped to tenant id)

#### branch **[async-hooks](https://github.com/moofoo/nestjs-prisma-postgres-tenancy/tree/async-hooks)** - Singleton providers using AsyncLocalStorage to manage session state per request

#

## Initial Setup

(make sure ports 5432 and 80 are free and docker is running)

```console
yarn setup
```

This script performs the following:

-   pull node, nginx, postgres and playwright images used by app
-   create tenancy_example_network network (needs to be external to run playwright tests)
-   create tenancy_example_db_data volume
-   create custom-node:latest image (see [Dockerfile.node](dockerfiles/Dockerfile.node))
-   start database service (this creates schema and inserts test data, see [db directory](db))
-   run 'yarn' command
-   build prismaclient and session-opts packages on host (see [packages directory](packages))
-   build frontend and backend images (see [apps directory](apps))
-   stop compose project (stops db service)

see [setup.sh](setup.sh)

## Running

```console
docker compose up -d
```

App should then be accessible at http://localhost.

Login form shows instructions for signing in as different tenants/users.

-   Non-admin users which are assigned to multiple tenants will go to a form for choosing their tenant, after which they will be authenticated and see data for that tenant.

-   Admin users assigned to multiple tenants will see data for all tenants

-   Non-admin users assigned to a single tenant will automatically login for that tenant (without needing to a choose a specific one)

Once logged in you will see data from the 'Patients' table and the 'Users' table, which will be filtered as per the Postgres RLS policy.

You can see Prisma Metrics json output at http://localhost/nest/stats

## Tests need to be updated for 'multi' branch

**Please be aware that this is a "toy" app meant to demonstrate the given programming concepts/techniques. It does **NOT** implement security best-practices and isn't intended to be representative of production-ready code**
