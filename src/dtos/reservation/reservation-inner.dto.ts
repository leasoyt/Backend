import { PickType } from "@nestjs/swagger";
import { Reservation } from "src/entities/reservation.entity";

export class ReservationInnerDto extends PickType(Reservation, ["seats", "date"]) { }