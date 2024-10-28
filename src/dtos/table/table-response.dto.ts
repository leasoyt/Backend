import { OmitType } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { Restaurant_Table } from "src/entities/tables.entity";

export class TableResponseDto extends OmitType(Restaurant_Table, ["restaurant", "reservations", "order"]) { 
    @IsOptional()
    @IsUUID()
    order?: string | undefined;

    @IsOptional()
    @IsUUID()
    reservations?: string | undefined;

    @IsOptional()
    @IsUUID()
    restaurant?: string | undefined;
 }