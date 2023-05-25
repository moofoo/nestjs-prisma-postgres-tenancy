import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaTenancyModule } from './prisma-tenancy/prisma-tenancy.module';
import { UsersModule } from './models/users/users.module';
import { PatientsModule } from './models/patients/patients.module';
import { TenantsModule } from './models/tenants/tenants.module';
import { AuthModule, AuthGuard } from '@/auth';

@Module({
  imports: [
    UsersModule,
    PatientsModule,
    TenantsModule,
    PrismaTenancyModule,
    AuthModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule { }
