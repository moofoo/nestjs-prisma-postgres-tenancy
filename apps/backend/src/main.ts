import { NestFactory } from '@nestjs/core';
import { PrismaService } from 'nestjs-prisma';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AuthMiddleware } from './auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('nest');

  app.use(cookieParser());

  app.use(AuthMiddleware);

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT || 3333, process.env.IN_CONTAINER === '1' ? '0.0.0.0' : '127.0.0.1');
}
bootstrap();
