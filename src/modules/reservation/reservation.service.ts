import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ReservationRepository } from "./reservation.repository";
import { CreateReservationDto } from "src/dtos/reservation/create-reservation.dto";
import { Reservation } from "src/entities/reservation.entity";
import { UserService } from "../user/user.service";
import { User } from "src/entities/user.entity";
import { arrayNotEmpty, isEmpty } from "class-validator";
import { Restaurant_Table } from "src/entities/tables.entity";
import { TableService } from "../table/table.service";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";
import { RestaurantService } from "../restaurant/restaurant.service";
import { Restaurant } from "src/entities/restaurant.entity";

@Injectable()
export class ReservationService {
    constructor(
        private readonly reservationRepository: ReservationRepository,
        private readonly tableService: TableService,
        private readonly userService: UserService,
        private readonly restaurantService: RestaurantService
    ) { }

    @TryCatchWrapper(HttpMessagesEnum.RESERVATION_CREATION_FAIL, InternalServerErrorException)
    async createReservation(reservationObject: CreateReservationDto): Promise<Reservation> {
        const { user_id, restaurant_id, ...rest } = reservationObject;

        const found_restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurant_id);
        const found_user: User = await this.userService.getRawUserById(user_id);

        const date = new Date(reservationObject.date);
        if (isEmpty(date)) {
            throw { error: "Date format is invalid", exception: BadRequestException };
        }

        return await this.reservationRepository.createReservation(found_restaurant, found_user, rest);
    }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getUserReservations(id: string): Promise<Reservation[]> {

        const user: User = await this.userService.getRawUserById(id);
        const reservations: Reservation[] = await this.reservationRepository.getUserReservations(user);

        if (arrayNotEmpty(reservations) || reservations === undefined) {
            throw { error: "No reservations found from this user" };
        }

        return reservations;
    }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getTableReservations(id: string): Promise<Reservation[]> {
        const table: Restaurant_Table = await this.tableService.getTableById(id);
        const reservations: Reservation[] = await this.reservationRepository.getTableReservations(table);

        if (arrayNotEmpty(reservations) || reservations === undefined) {
            throw { error: "No reservations found for this table" };
        }
        return reservations;
    }
}