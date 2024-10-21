import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ApiTags } from "@nestjs/swagger";
import { Reservation } from "src/entities/reservation.entity";
import { CreateReservationDto } from "src/dtos/reservation/create-reservation.dto";

@ApiTags("Reservation")
@Controller("reservation")
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    @Get("user/:id")
    async getUserReservations(@Param("id", ParseUUIDPipe) id: string): Promise<Reservation[]> {
        return await this.reservationService.getUserReservations(id);
    }

    @Get("table/:id")
    async getTableReservations(@Param("id", ParseUUIDPipe) id: string): Promise<Reservation[]> {
        return await this.reservationService.getTableReservations(id);
    }

    @Post()
    async createReservation(@Body() reservationObject: CreateReservationDto): Promise<any> {
        return await this.reservationService.createReservation(reservationObject);
    }

    @Put("cancel/:id")
    async cancelReservation(@Param("id") id: string): Promise<any> {

    }

    @Put("complete/:id")
    async completeReservation(@Param("id") id: string): Promise<any> {
        
    }
}