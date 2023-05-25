import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { UsersModule } from "@/models/users/users.module";
import { TenantsModule } from "@/models/tenants/tenants.module";
import { AuthService } from "./auth.service";

@Module({
      imports: [UsersModule, TenantsModule],
      providers: [AuthService],
      controllers: [AuthController]
})
export class AuthModule { } 