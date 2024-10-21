import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class OrderedDishesDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({description: 'Id de un \"Dish\" registrado en la base de datos', example: '15052f70-2c24-4516-be44-673ec4876788', required: true})
  id: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({description: 'Cantidad de cada platillo en la orden', example: '3', required: true})
  quantity: number
}