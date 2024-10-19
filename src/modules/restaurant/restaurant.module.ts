import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "src/entities/restaurant.entity";
import { RestaurantRepository } from "./restaurant.repository";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant])],
    controllers: [RestaurantController],
    providers: [RestaurantService, RestaurantRepository],
    exports: [RestaurantService]
})
export class RestaurantModule { }
