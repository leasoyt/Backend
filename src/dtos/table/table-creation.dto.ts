import { IsInt, IsNotEmpty, IsUUID, Max, Min } from "class-validator";

export class TableCreationDto {
    @IsInt()
    @Min(0)
    @Max(1000)
    @IsNotEmpty()
    table_number: number;

    @IsUUID()
    @IsNotEmpty()
    restaurant_id: string;
}