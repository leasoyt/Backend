import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator"
import { OrderedDishesDto } from "./ordered_dishes.dto"
import { Type } from "class-transformer"

export class CreateOrderRDto {
    @IsNotEmpty()
    @IsUUID()
    table: string
    @IsArray()
    @ArrayMinSize(1, { message: 'La orden debe tener al menos un platillo' })
    @ValidateNested({ each: true, message: ' Cada platillo en la orden debe ser un UUID válido' })
    @Type(() => OrderedDishesDto)
    ordered_dishes: OrderedDishesDto[]
}