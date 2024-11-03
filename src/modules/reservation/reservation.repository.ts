import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationInnerDto } from "src/dtos/reservation/reservation-inner.dto";
import { Reservation } from "src/entities/reservation.entity";
import { Restaurant } from "src/entities/restaurant.entity";
import { Restaurant_Table } from "src/entities/tables.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReservationRepository {

    constructor(@InjectRepository(Reservation) private reservationRepository: Repository<Reservation>) { }

    async createReservation(restaurant: Restaurant, user: User, reservationObject: ReservationInnerDto): Promise<Reservation> {
        const created_reservation: Reservation = this.reservationRepository.create({ user: user, ...reservationObject, restaurant: restaurant });
        const saved_reservation: Reservation = await this.reservationRepository.save(created_reservation);

        return await this.reservationRepository.findOne({ where: { id: saved_reservation.id }, relations: { restaurant: true, user: true } });
    }

    async getUserReservations(userInstance: User): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationRepository.find({ where: { user: userInstance }, relations: { restaurant: true, table: true } });

        return reservations;
    }

    async getTableReservations(tableInstance: Restaurant_Table): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationRepository.find({ where: { table: tableInstance }, relations: { restaurant: true, user: true } });

        return reservations;
    }

    async getRestaurantReservations(restaurantInstance: Restaurant): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationRepository.find({ where: { restaurant: restaurantInstance }, relations: { user: true, table: true } });

        return reservations;
    }
}