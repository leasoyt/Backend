import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator"
import { orderStatus } from "src/enums/orderStatus.enum"

export class OrderStatusDto {
    @ApiProperty({ enum: orderStatus, description: 'Estatus de la orden' })
    @IsNotEmpty()
    @IsEnum(orderStatus)
    status: orderStatus;
}