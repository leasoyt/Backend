import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReservationDto } from "src/dtos/reservation/create-reservation.dto";
import { Reservation } from "src/entities/reservation.entity";
import { Restaurant } from "src/entities/restaurant.entity";
import { Restaurant_Table } from "src/entities/tables.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReservationRepository {
    constructor(@InjectRepository(Reservation) private reservationRepository: Repository<Reservation>) { }

    async createReservation(restaurant: Restaurant, user: User, reservationObject: Omit<CreateReservationDto, "restaurant_id" | "user_id">): Promise<Reservation> {
        const date = new Date(reservationObject.date);
        const created_reservation: Reservation = this.reservationRepository.create({ date, user,  });
        return new Reservation();
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