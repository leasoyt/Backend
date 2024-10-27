import { PartialType } from "@nestjs/swagger";
import { ReservationCreateDto } from "./reservation-create.dto";

export class ReservationUpdateDto extends PartialType(ReservationCreateDto){}