import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { UsersModule } from "@/models/users/users.module";
import { TenantsModule } from "@/models/tenants/tenants.module";
import { UserTenantsModule } from "@/models/tenant-users/user-tenants.module";
import { AuthService } from "./auth.service";

@Module({
      imports: [UsersModule, TenantsModule, UserTenantsModule],
      providers: [AuthService],
      controllers: [AuthController]
})
export class AuthModule { } 