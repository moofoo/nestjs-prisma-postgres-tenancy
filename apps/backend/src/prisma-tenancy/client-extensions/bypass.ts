
import { PrismaModule, PrismaService } from 'nestjs-prisma';

const useFactory = (prisma: PrismaService) => {
      console.log('Bypass Client useFactory called');

      return prisma.$extends({
            query: {
                  $allModels: {
                        async $allOperations({ args, query }) {
                              const [, result] = await prisma.$transaction([
                                    prisma.$executeRaw`SELECT set_config('tenancy.tenant_id', '0', TRUE), set_config('tenancy.bypass', '1', TRUE)`,
                                    query(args),
                              ]);
                              return result;
                        },
                  },
            },
      });
};

export type ExtendedBypassClient = ReturnType<typeof useFactory>;

export const BYPASS_CLIENT_TOKEN = Symbol('BYPASS_CLIENT_TOKEN');

export const PrismaBypassClientProvider = {
      provide: BYPASS_CLIENT_TOKEN,
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory,
};