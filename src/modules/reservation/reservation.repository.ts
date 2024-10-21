import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { Restaurant_Table } from "src/entities/tables.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReservationRepository {
    constructor(@InjectRepository(Reservation) private reservationRepository: Repository<Reservation>) { }

    async createReservation(): Promise<Reservation> {
        const 
    }

    async getUserReservations(userInstance: User): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationRepository.find({ where: { user: userInstance } });
        return reservations;
    }

    async getTableReservations(tableInstance: Restaurant_Table): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationRepository.find({ where: { table: tableInstance } });
        return reservations;
    }
}