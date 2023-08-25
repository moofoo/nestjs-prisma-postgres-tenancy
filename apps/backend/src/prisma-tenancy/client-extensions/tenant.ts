
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Scope } from '@nestjs/common';
import { SessionData } from 'session-opts';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

const useFactory = (prisma: PrismaService, req: Request & { session: SessionData; }) => {
      console.log('Tenant Client useFactory called');

      return prisma.$extends({
            query: {
                  $allModels: {
                        async $allOperations({ args, query }) {
                              const session = (req?.session || {}) as SessionData;
                              console.log({ session });
                              const userId = session?.userId;
                              const tenantIds = session?.tenantIds || [0];
                              const isAdmin = session?.isAdmin || false;

                              const [, result] = await prisma.$transaction([
                                    prisma.$executeRaw`SELECT set_config('tenancy.user_id', ${`${userId || 0}`}, TRUE), set_config('tenancy.tenant_ids',  ${"{" + tenantIds.join(", ") + "}"}, TRUE), set_config('tenancy.bypass', ${`${isAdmin ? 1 : 0}`}, TRUE)`,
                                    query(args),
                              ]);
                              return result;
                        },
                  },
            },
      });
};

export type ExtendedTenantReqScopeClient = ReturnType<typeof useFactory>;

export const TENANCY_REQ_SCOPE_CLIENT_TOKEN = Symbol('TENANCY_REQ_SCOPE_CLIENT_TOKEN');

export const PrismaTenancyReqScopeClientProvider = {
      provide: TENANCY_REQ_SCOPE_CLIENT_TOKEN,
      imports: [PrismaModule],
      inject: [PrismaService, REQUEST],
      useFactory,
      scope: Scope.REQUEST,
      durable: true
};