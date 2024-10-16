import { PartialType } from "@nestjs/swagger";
import { CreateReservationDto } from "./create-reservation.dto";

export class UpdateReservation extends PartialType(CreateReservationDto){}