import { Injectable } from '@nestjs/common';
import type { Prisma } from 'prismaclient';
import { PrismaTenancyService } from '@/prisma-tenancy/prisma-tenancy.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaTenancyService) { }

    findMany(input: Prisma.UserFindManyArgs, bypass = false) {
        return this.prisma.switch(bypass).user.findMany(input);
    }

    findUnique(input: Prisma.UserFindUniqueArgs, bypass = false) {
        return this.prisma.switch(bypass).user.findUnique(input);
    }

    findFirst(input: Prisma.UserFindFirstArgs, bypass = false) {
        return this.prisma.switch(bypass).user.findFirst(input);
    }
}