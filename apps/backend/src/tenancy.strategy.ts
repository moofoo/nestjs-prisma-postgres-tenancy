import {
      HostComponentInfo,
      ContextId,
      ContextIdFactory,
} from '@nestjs/core';
import { Request } from 'express';

const tenants = new Map<string | number, ContextId>();

export class AggregateByTenantContextIdStrategy {
      attach(contextId: ContextId, request: Request) {
            const { session = { tenantId: 0 } } = request;

            const tenantId = (session as any).tenantId;

            let tenantSubTreeId: ContextId;

            if (tenants.has(tenantId)) {
                  tenantSubTreeId = tenants.get(tenantId);
            } else {
                  tenantSubTreeId = ContextIdFactory.create();
                  tenants.set(tenantId, tenantSubTreeId);
            }

            return (info: HostComponentInfo) => {
                  return info.isTreeDurable ? tenantSubTreeId : contextId;
            };

      }
}