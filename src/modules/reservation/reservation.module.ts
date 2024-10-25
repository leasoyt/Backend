import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";
import { ReservationRepository } from "./reservation.repository";
import { UsersModule } from "../user/user.module";
import { RestaurantModule } from "../restaurant/restaurant.module";

@Module({
    imports: [UsersModule, RestaurantModule, TypeOrmModule.forFeature([Reservation])],
    controllers: [ReservationController],
    providers: [ReservationService,ReservationRepository]
})
export class ReservationModule { }