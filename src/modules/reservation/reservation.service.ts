/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ReservationRepository } from "./reservation.repository";
import { ReservationCreateDto } from "src/dtos/reservation/reservation-create.dto";
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
import { ReservationResponseDto } from "src/dtos/reservation/reservation-response.dto";

@Injectable()
export class ReservationService {
    constructor(
        private readonly reservationRepository: ReservationRepository,
        private readonly tableService: TableService,
        private readonly userService: UserService,
        private readonly restaurantService: RestaurantService
    ) { }

    @TryCatchWrapper(HttpMessagesEnum.RESERVATION_CREATION_FAIL, InternalServerErrorException)
    async createReservation(reservationObject: ReservationCreateDto): Promise<ReservationResponseDto> {
        const { user_id, restaurant_id, ...rest } = reservationObject;
        const found_restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurant_id);
        const found_user: User = await this.userService.getRawUserById(user_id);
        const datedto = new Date(reservationObject.date);
        console.log(reservationObject.date)
        console.log(datedto)
        if (isEmpty(datedto)) {
            throw { error: "Date format is invalid", exception: BadRequestException };
        }
        
        const created_reservation = await this.reservationRepository.createReservation(found_restaurant, found_user, { ...rest, date: datedto });
        return this.formatReservation(created_reservation);
    }

    private formatReservation(unFormated: Reservation): ReservationResponseDto {
        try {
            const { id, date, status, seats, restaurant, user, table } = unFormated;
            return { id, date, status, seats, restaurant: restaurant?.id || undefined, user: user?.id || undefined, table: table?.id || undefined };
        } catch (err) {
            throw {error: `${err}`};
        }
    }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getUserReservations(id: string): Promise<ReservationResponseDto[]> {
        const user: User = await this.userService.getRawUserById(id);
        const reservations: Reservation[] = await this.reservationRepository.getUserReservations(user);

        if (!arrayNotEmpty(reservations) || reservations === undefined) {
            throw { error: HttpMessagesEnum.NO_RESERVATIONS_IN_USER };
        }

        return reservations.map((x) => {
            return this.formatReservation(x);
        });
    }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getRestaurantReservations(id: string): Promise<ReservationResponseDto[]> {
        const restaurant: Restaurant = await this.restaurantService.getRestaurantById(id);
        const reservations: Reservation[] = await this.reservationRepository.getRestaurantReservations(restaurant);

        if (!arrayNotEmpty(reservations) || reservations === undefined) {
            throw { error: HttpMessagesEnum.NO_RESERVATIONS_IN_RESTAURANT };
        }

        return reservations.map((x) => {
            return this.formatReservation(x);
        });
    }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getTableReservations(id: string): Promise<ReservationResponseDto[]> {
        const table: Restaurant_Table = await this.tableService.getRawTableById(id);
        const reservations: Reservation[] = await this.reservationRepository.getTableReservations(table);

        if (!arrayNotEmpty(reservations) || reservations === undefined) {
            throw { error: HttpMessagesEnum.NO_RESERVATIONS_IN_TABLE };
        }

        return reservations.map((x) => {
            return this.formatReservation(x);
        });
    }
}