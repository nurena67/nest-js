import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // Jika menggunakan cookie atau header Authorization
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
