import { Module } from '@nestjs/common';
import { UserTenantsService } from './user-tenants.service';

@Module({
    providers: [UserTenantsService],
    exports: [UserTenantsService],

})
export class UserTenantsModule { }
