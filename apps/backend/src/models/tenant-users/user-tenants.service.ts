import { Injectable } from '@nestjs/common';
import type { Prisma } from 'prismaclient';
import { PrismaTenancyService } from '@/prisma-tenancy/prisma-tenancy.service';

@Injectable()
export class UserTenantsService {
    constructor(private readonly prisma: PrismaTenancyService) { }

    findMany(input: Prisma.UserTenantsFindManyArgs, bypass = false) {
        return this.prisma.switch(bypass).userTenants.findMany(input);
    }

    findUnique(input: Prisma.UserTenantsFindUniqueArgs, bypass = false) {
        return this.prisma.switch(bypass).userTenants.findUnique(input);
    }
}