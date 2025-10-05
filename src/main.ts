import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  app.use(json({ limit: '50mb' }));
  app.use('/videos', express.static(path.join(__dirname, '../public/videos')));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  console.log('Server started on port 3001');
  await app.listen(3001);
}
bootstrap();