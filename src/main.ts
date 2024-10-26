import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './helpers/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

import { config as dotenvConfig } from 'dotenv';


dotenvConfig({path: '.env'})

async function bootstrap() {
  console.log(process.env.DB_PORT)
  console.log(process.env.DB_HOST)
  console.log(process.env.DB_USERNAME)
  console.log(process.env.DB_PASSWORD)
  console.log(process.env.DB_DATABASE)
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter())
  const config = new DocumentBuilder()
    .setTitle('RestO Api')
    .setDescription('RestO Api documentacion, rutas, DTOs, entidades')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000'
  });
  await app.listen(4000);
}

bootstrap();
