import { IsDateString, IsEnum, IsNumber, IsOptional, IsUUID } from "class-validator";
import { ReservationStatus } from "src/enums/reservationStatus.enum";

export class ReservationResponseDto {
    @IsUUID()
    id: string;
    
    @IsDateString()
    date: Date;

    @IsEnum(ReservationStatus)
    status: ReservationStatus;

    @IsNumber()
    seats: number;

    @IsUUID()
    user: string;

    @IsOptional()
    @IsUUID()
    restaurant: string | undefined;

    @IsOptional()
    @IsUUID()
    table: string | undefined;
}