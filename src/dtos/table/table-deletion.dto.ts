import { IsNotEmpty, IsUUID } from "class-validator";

export class TableDeletionDto {
    @IsUUID()
    @IsNotEmpty()
    restaurant_id: string;

    @IsUUID()
    @IsNotEmpty()
    table_id: string;
}