import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/entities/dish.entity';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { DishRepository } from './dish.repository';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [MenuModule, TypeOrmModule.forFeature([Dish])],
  providers: [DishService, DishRepository],
  controllers: [DishController],
  // imports: [TypeOrmModule.forFeature([Dish, Menu])],
  // providers:Stashed changes [DishService, DishRepository],
  // controllers: [DishController],
  exports: [DishService]
})
export class DishModule {}
