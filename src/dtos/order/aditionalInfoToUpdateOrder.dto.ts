import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator"
import { orderStatus } from "src/enums/orderStatus.enum"

export class AditionalInfoToUpdateOrder {
    @ApiProperty({ enum: orderStatus, description: 'Estatus de la orden' })
    @IsEnum(orderStatus)
    status: orderStatus;
}