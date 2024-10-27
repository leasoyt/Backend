import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";
import { ReservationRepository } from "./reservation.repository";
import { UsersModule } from "../user/user.module";
import { RestaurantModule } from "../restaurant/restaurant.module";
import { TableModule } from "../table/table.module";

@Module({
    imports: [UsersModule, RestaurantModule, TableModule, TypeOrmModule.forFeature([Reservation])],
    controllers: [ReservationController],
    providers: [ReservationService, ReservationRepository]
})
export class ReservationModule { }