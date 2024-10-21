import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator"
import { orderStatus } from "src/enums/orderStatus.enum"

export class AditionalInfoToUpdateOrder {
    @ApiProperty()
    @IsEnum(orderStatus)
    status: orderStatus;
}