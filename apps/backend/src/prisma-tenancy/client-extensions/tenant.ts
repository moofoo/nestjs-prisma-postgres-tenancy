import { ClsService } from 'nestjs-cls';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import type { SessionData } from 'session-opts';

const useFactory = (prisma: PrismaService, store: ClsService) => {
      console.log('Tenant Client useFactory called');

      return prisma.$extends({
            query: {
                  $allModels: {
                        async $allOperations({ args, query }) {
                              const session: SessionData = store.get('session');
                              const { tenantId, isAdmin } = session;

                              const [, result] = await prisma.$transaction([
                                    prisma.$executeRaw`SELECT set_config('tenancy.tenant_id', ${`${tenantId || 0}`}, TRUE), set_config('tenancy.bypass', ${`${isAdmin ? 1 : 0}`}, TRUE)`,
                                    query(args),
                              ]);
                              return result;
                        },
                  },
            },
      });
};

export type ExtendedTenantClient = ReturnType<typeof useFactory>;

export const TENANCY_CLIENT_TOKEN = Symbol('TENANCY_CLIENT_TOKEN');

export const PrismaTenancyClientProvider = {
      provide: TENANCY_CLIENT_TOKEN,
      imports: [PrismaModule],
      inject: [PrismaService, ClsService],
      useFactory
};