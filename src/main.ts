import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './helpers/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder().setTitle('RestO Api')
    .setDescription('RestO Api documentacion, rutas, DTOs, entidades')
    .setVersion('1.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:3000'
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}

bootstrap();
