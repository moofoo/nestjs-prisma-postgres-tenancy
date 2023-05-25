import { Injectable, Inject, Scope } from '@nestjs/common';
import {
      BYPASS_REQ_SCOPE_CLIENT_TOKEN,
      TENANCY_REQ_SCOPE_CLIENT_TOKEN,
      ExtendedTenantReqScopeClient,
      ExtendedBypassReqScopeClient
} from './client-extensions';

@Injectable()
export class PrismaTenancyService {
      constructor(
            @Inject(TENANCY_REQ_SCOPE_CLIENT_TOKEN) private readonly tenantService: ExtendedTenantReqScopeClient,
            @Inject(BYPASS_REQ_SCOPE_CLIENT_TOKEN) private readonly bypassService: ExtendedBypassReqScopeClient
      ) {
            console.log("PrismaTenancyService constructer executed");
      }
      get tenancy() {
            return this.tenantService;
      }

      get bypass() {
            return this.bypassService;
      }

      public switch(bypass?: boolean) {
            return bypass ? this.bypassService : this.tenantService;
      }
}