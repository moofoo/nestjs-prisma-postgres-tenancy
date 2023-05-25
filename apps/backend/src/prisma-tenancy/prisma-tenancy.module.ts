import { Module, Global } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { PrismaTenancyReqScopeClientProvider, PrismaBypassReqScopeClientProvider } from './client-extensions';
import { PrismaTenancyService } from './prisma-tenancy.service';

@Global()
@Module({
      imports: [PrismaModule],
      providers: [PrismaService, PrismaTenancyService, PrismaTenancyReqScopeClientProvider, PrismaBypassReqScopeClientProvider],
      exports: [PrismaTenancyService]
})
export class PrismaTenancyModule { }