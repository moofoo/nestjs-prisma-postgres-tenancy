import {
    Controller,
    Get,
    Param,
    ParseIntPipe
} from '@nestjs/common';

import { TenantsService } from './tenants.service';
@Controller('tenants')
export class TenantsController {
    constructor(private readonly tenants: TenantsService) { }

    @Get()
    findMany() {
        return this.tenants.findMany({});
    }

    @Get(':id')
    findUnique(@Param('id', ParseIntPipe) id: number) {
        return this.tenants.findUnique({ where: { id } });
    }
}

