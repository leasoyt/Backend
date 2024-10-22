import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator"
import { OrderedDishesDto } from "./ordered_dishes.dto"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class CreateOrderDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({description: 'Id de una \"Table\" registrada en la base de datos', example: '15052f70-2c24-4516-be44-673ec4876788', required: true})
    table: string;
    
    @IsArray()
    @ArrayMinSize(1, { message: 'La orden debe tener al menos un platillo' })
    @ValidateNested({ each: true, message: ' Cada platillo en la orden debe ser un UUID válido' })
    @Type(() => OrderedDishesDto)
    @ApiProperty({
        description: 'Array de platillos pedidos',
        type: [OrderedDishesDto],
        example: [
          { id: '15052f70-2c24-4516-be44-673ec4876788', quantity: 3 },
          { id: '23456e70-2c24-4516-be44-673ec4876789', quantity: 2 },
        ],
        required: true,}
    )
    ordered_dishes: OrderedDishesDto[]
}