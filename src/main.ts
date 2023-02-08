import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { AppModule } from './app.module';

config();
const { APP_PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  (global as typeof global & { app: any }).app = app;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true });
  app.use(cookieParser());
  await app.listen(process.env.PORT || APP_PORT);
}
bootstrap();
