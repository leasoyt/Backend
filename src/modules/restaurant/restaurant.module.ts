import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "src/entities/restaurant.entity";
import { RestaurantRepository } from "./restaurant.repository";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";
import { MenuModule } from "../menu/menu.module";
import { UsersModule } from "../user/user.module";

@Module({
    imports: [UsersModule, forwardRef(() => MenuModule) , TypeOrmModule.forFeature([Restaurant])],
    controllers: [RestaurantController],
    providers: [RestaurantService, RestaurantRepository],
    exports: [RestaurantService]
})
export class RestaurantModule { }