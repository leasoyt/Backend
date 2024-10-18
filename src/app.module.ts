// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishModule } from './modules/dish/dish.module';
import typeOrmConfig from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), DishModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
