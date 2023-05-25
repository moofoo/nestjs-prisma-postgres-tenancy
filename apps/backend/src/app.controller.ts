import { Controller, Get } from '@nestjs/common';
import { PrismaTenancyService } from './prisma-tenancy/prisma-tenancy.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaTenancyService) { }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('/stats')
  getStats() {
    const metrics = this.prisma.switch(true).$metrics.json();
    return metrics;
  }
}
