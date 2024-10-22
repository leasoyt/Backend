import { Injectable, NotFoundException } from "@nestjs/common";
import { ReservationRepository } from "./reservation.repository";
import { CreateReservationDto } from "src/dtos/reservation/create-reservation.dto";
import { Reservation } from "src/entities/reservation.entity";
import { UserService } from "../user/user.service";
import { User } from "src/entities/user.entity";
import { arrayNotEmpty } from "class-validator";
import { Restaurant_Table } from "src/entities/tables.entity";
import { TableService } from "../table/table.service";
import { CustomMessagesEnum } from "src/dtos/custom-responses.dto";

@Injectable()
export class ReservationService {
    constructor(private readonly reservationRepository: ReservationRepository, private readonly tableService: TableService, private readonly userService: UserService) { }

    async createReservation(reservationObject: CreateReservationDto): Promise<any> {
        // const table: Restaurant_Table = await this.tableService.getTableById(reservationObject.);
    }

    async getUserReservations(id: string): Promise<Reservation[]> {
        try {
            const user: User = await this.userService.getRawUserById(id);
            const reservations: Reservation[] = await this.reservationRepository.getUserReservations(user);
    
            if(arrayNotEmpty(reservations) || reservations === undefined) {
                throw {error: "No reservations found from this user"};
            }

            return reservations;
        } catch (err) {
            throw new NotFoundException({message: CustomMessagesEnum.RESOURCE_NOT_FOUND, error: err.error | err});
        }
    }

    async getTableReservations(id: string): Promise<Reservation[]> {
        const table: Restaurant_Table = await this.tableService.getTableById(id);
        const reservations: Reservation[] = await this.reservationRepository.getTableReservations(table);

        if(arrayNotEmpty(reservations) || reservations === undefined) {
            throw new NotFoundException("No reservations found for this establishment");
        }
        return reservations;
    }
}