import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dish } from "src/entities/dish.entity";
import { DishService } from "./dish.service";
import { DishController } from "./dish.controller";
import { DishRepository } from "./dish.repository";
import { Menu_Category } from "src/entities/menu_category.entity";
import { MenuCategoryModule } from "../menu_category/menu_category.module";

@Module({
  // imports: [MenuModule, TypeOrmModule.forFeature([Dish])],
    imports: [ MenuCategoryModule,TypeOrmModule.forFeature([Dish,Menu_Category])],
    providers: [DishService,DishRepository],
    controllers: [DishController],
    exports: [DishService]
})
export class DishModule {}
