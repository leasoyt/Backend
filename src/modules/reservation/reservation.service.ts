import { Injectable, NotFoundException } from "@nestjs/common";
import { ReservationRepository } from "./reservation.repository";
import { CreateReservationDto } from "src/dtos/reservation/create-reservation.dto";
import { Reservation } from "src/entities/reservation.entity";
import { UserService } from "../user/user.service";
import { User } from "src/entities/user.entity";
import { arrayNotEmpty } from "class-validator";
import { Restaurant_Table } from "src/entities/tables.entity";
import { TableService } from "../table/table.service";

@Injectable()
export class ReservationService {
    constructor(private readonly reservationRepository: ReservationRepository, private readonly tableService: TableService, private readonly userService: UserService) { }

    async createReservation(reservationObject: CreateReservationDto): Promise<any> {
        const table: Restaurant_Table = await this.tableService.getTable(reservationObject.);
    }

    async getUserReservations(id: string): Promise<Reservation[]> {
        const user: User = await this.userService.getRawUserById(id);
        const reservations: Reservation[] = await this.reservationRepository.getUserReservations(user);

        if(arrayNotEmpty(reservations) || reservations === undefined) {
            throw new NotFoundException("No reservations found for this user");
        }
        return reservations;
    }

    async getTableReservations(id: string): Promise<Reservation[]> {
        const table: Restaurant_Table = await this.tableService.getTable(id);
        const reservations: Reservation[] = await this.reservationRepository.getTableReservations(table);

        if(arrayNotEmpty(reservations) || reservations === undefined) {
            throw new NotFoundException("No reservations found for this establishment");
        }
        return reservations;
    }
}