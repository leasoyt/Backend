import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class ReservationCreateDto {
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @IsNotEmpty()
    @IsUUID()
    restaurant_id: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsInt()
    @IsOptional()
    seats: number;
}