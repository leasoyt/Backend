import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateReservationDto {
    @IsNotEmpty()
    @IsUUID()
    usuario: string
    @IsNotEmpty()
    @IsUUID()
    establecimiento: string
    @IsNotEmpty()
    @IsDateString()
    date: string
    @IsUUID()
    @IsOptional()
    table?: string
    @IsInt()
    @IsOptional()
    seats?: number
}