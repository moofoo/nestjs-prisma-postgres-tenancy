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

#### branch **[multi](https://github.com/moofoo/nestjs-prisma-postgres-tenancy/tree/multi)** - Request scoped providers, allows users to belong to multiple tenants

#

You will probably need to clear your browser cache when switching to and from the 'multi' branch

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

Login form shows instructions for signing in as different tenants/users

For example, to log in as user 2 of tenant 3:

-   username: **t3 user2**
-   password: **user**

Admin login:

-   username: **t6 admin**
-   password: **admin**

Once logged in you will see data from the 'Patients' table, which will be filtered as per the Postgres RLS policy.

You can see Prisma Metrics json output at http://localhost/nest/stats

## Tests

While compose project is running,

```console
yarn test
```

see [test.sh](test.sh)

This will run playwright with the following playwright.config.ts:

```typescript
import {defineConfig} from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    workers: 50,
    repeatEach: 50,
    reporter: "html",
    use: {
        trace: "on-first-retry",
        bypassCSP: true,
    },
});
```

The `50` value for `repeatEach` and `worker` means the test (there's only one) runs 50 times in parallel. The test simply authenticates with the backend using a randomly chosen tenant/user and checks the validity of the Patients json returned by GET `http://localhost/nest/patients`.

#

## Notes on branches and backend log output

If you take a look at the backend Prisma Tenancy Service implementation, you'll see that the useFactory functions for the Bypass and Tenant Providers and the constructor of the Prisma Tenancy Service have console.log statements, to indicate when they are executed / instantiated.

-   [tenant.ts](apps/backend/src/prisma-tenancy/client-extensions/tenant.ts)
-   [bypass.ts](apps/backend/src/prisma-tenancy/client-extensions/bypass.ts)
-   [prisma-tenancy.service.ts](apps/backend/src/prisma-tenancy/prisma-tenancy.service.ts)

When and where those console.logs appear in the backend logs depends on how the Providers are scoped (and therefore will vary depending on which branch you have checked out)

For each branch, you should see `Bypass Client useFactory called` along with the usual NestJS initialization log output, since that provider is not request scoped (it doesn't need to know the tenancy of the connecting user).

The `main` and `durable` branches will output the following to the backend logs when a user logs in or Patients data is requested:

```console
Tenant Client useFactory called
PrismaTenancyService constructer executed
```

For the `main` branch (request scoped provider), the above should appear in the logs for every request.

For the `durable` branch, (durable request scoped provider, based on tenant id), you should see the above only once for each connecting tenant.

With the `async-hooks` branch, you should see the following along with the usual NestJS initialization output. There should be no additional log output for each request:

```console
Tenant Client useFactory called
Bypass Client useFactory called
PrismaTenancyService constructer executed
```

## Docker Notes

Follow these steps when adding app dependencies:

#### 1 - Add the dependencies

```
yarn workspace add APP_NAME DEPENDENCY (or yarn workspace add -D ... for dev deps)
```

for example,

```
yarn workspace backend add bcrypt
```

#### 2 - Run docker compose up -d --build --force-recreate for service

```
docker compose up -d -V --force-recreate --build backend
```

#### 3 - Restart the project (so the nginx service doesn't lose the plot)

```
docker compose restart
```

### Prisma Resources

-   [Client Extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions)
-   [Client Extensions RLS Example](https://github.com/prisma/prisma-client-extensions/tree/main/row-level-security)
-   [Query Extension](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/query)
-   [Transactions and batch queries](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
-   [Raw database access](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw)

### Postgres Resources

-   [Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
-   [System Administration Functions (set_config)](https://www.postgresql.org/docs/8.0/functions-admin.html)

### NestJS Resources

-   [Custom Factory Provider](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory)
-   [Recipe: AsyncLocalStorage](https://docs.nestjs.com/recipes/async-local-storage)
-   [Recipe: Prisma](https://docs.nestjs.com/recipes/prisma)
-   [nestjs-cls](https://github.com/Papooch/nestjs-cls)
-   [nestjs-prisma](https://nestjs-prisma.dev/)

### NGINX

-   [Beginner's Guide](http://nginx.org/en/docs/beginners_guide.html)
-   [Using the Forwarded Header](https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/)
-   [Full Config Example](https://www.nginx.com/resources/wiki/start/topics/examples/full/)

#

#

**Please be aware that this is a "toy" app meant to demonstrate the given programming concepts/techniques. It does **NOT** implement security best-practices and isn't intended to be representative of production-ready code**
