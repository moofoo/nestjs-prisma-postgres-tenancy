import { Module, Global } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { PrismaTenancyClientProvider, PrismaBypassClientProvider } from './client-extensions';
import { PrismaTenancyService } from './prisma-tenancy.service';

@Global()
@Module({
      imports: [PrismaModule],
      providers: [PrismaService, PrismaTenancyService, PrismaTenancyClientProvider, PrismaBypassClientProvider],
      exports: [PrismaTenancyService]
})
export class PrismaTenancyModule { }