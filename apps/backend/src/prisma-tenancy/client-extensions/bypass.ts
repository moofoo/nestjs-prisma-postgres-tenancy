
import { PrismaModule, PrismaService } from 'nestjs-prisma';

const useFactory = (prisma: PrismaService) => {
      console.log('Bypass Client useFactory called');

      return prisma.$extends({
            query: {
                  $allModels: {
                        async $allOperations({ args, query }) {

                              const [, result] = await prisma.$transaction([
                                    prisma.$executeRaw`SELECT set_config('tenancy.user_id', '0', TRUE), set_config('tenancy.tenant_ids', '0', TRUE), set_config('tenancy.bypass', '1', TRUE)`,
                                    query(args),
                              ]);
                              return result;
                        },
                  },
            },
      });
};

export type ExtendedBypassReqScopeClient = ReturnType<typeof useFactory>;

export const BYPASS_REQ_SCOPE_CLIENT_TOKEN = Symbol('BYPASS_REQ_SCOPE_CLIENT_TOKEN');

export const PrismaBypassReqScopeClientProvider = {
      provide: BYPASS_REQ_SCOPE_CLIENT_TOKEN,
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory,
};