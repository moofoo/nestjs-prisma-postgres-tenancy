import { Injectable } from '@nestjs/common';
import type { Prisma } from 'prismaclient';
import { PrismaTenancyService } from '@/prisma-tenancy/prisma-tenancy.service';

@Injectable()
export class TenantsService {
    constructor(private readonly prisma: PrismaTenancyService) { }

    findMany(input: Prisma.TenantFindManyArgs, bypass = false) {
        return this.prisma.switch(bypass).tenant.findMany(input);
    }

    findUnique(input: Prisma.TenantFindUniqueArgs, bypass = false) {
        return this.prisma.switch(bypass).tenant.findUnique(input);
    }
}