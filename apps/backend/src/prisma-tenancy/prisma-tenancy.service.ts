import { Injectable, Inject } from '@nestjs/common';
import {
      BYPASS_CLIENT_TOKEN,
      TENANCY_CLIENT_TOKEN,
      ExtendedTenantClient,
      ExtendedBypassClient
} from './client-extensions';

@Injectable()
export class PrismaTenancyService {
      constructor(
            @Inject(TENANCY_CLIENT_TOKEN) private readonly tenantService: ExtendedTenantClient,
            @Inject(BYPASS_CLIENT_TOKEN) private readonly bypassService: ExtendedBypassClient
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