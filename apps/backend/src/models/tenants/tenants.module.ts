import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';

@Module({
    providers: [TenantsService],
    exports: [TenantsService],
    controllers: [TenantsController]
})
export class TenantsModule { }
