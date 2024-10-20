import { Type } from "class-transformer";
import { IsDate, IsEnum, ValidateNested } from "class-validator"
import { orderStatus } from "src/enums/orderStatus.enum"

export class AditionalInfoToUpdateOrder {
    @IsEnum(orderStatus)
    status: orderStatus;
}