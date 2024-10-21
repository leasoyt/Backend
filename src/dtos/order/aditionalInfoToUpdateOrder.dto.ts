import { IsEnum } from "class-validator"
import { orderStatus } from "src/enums/orderStatus.enum"

export class AditionalInfoToUpdateOrder {
    @IsEnum(orderStatus)
    status: orderStatus;
}