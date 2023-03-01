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
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://teesas-personal.vercel.app'],
  });
  app.use(cookieParser());
  await app.listen(APP_PORT);
}
bootstrap();
