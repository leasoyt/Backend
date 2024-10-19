
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dish } from "src/entities/dish.entity";
import { DishService } from "./dish.service";
import { DishController } from "./dish.controller";
import { Menu } from "src/entities/menu.entity";
import { DishRepository } from "./dish.repository";
import { MenuRepository } from "./PruebaMenuRepository";

@Module({
    imports: [TypeOrmModule.forFeature([Dish, Menu])],
    providers: [DishService, DishRepository, MenuRepository],
    controllers: [DishController]
})
export class DishModule { }