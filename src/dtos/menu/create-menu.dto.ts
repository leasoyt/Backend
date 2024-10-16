import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID, isUUID, Length, ValidateNested } from "class-validator"
import { CreateDishDto } from "../dish/create-dish.dto"

export class CreateMenuDto {
    @IsNotEmpty()
    @Length(3, 40)
    @IsString()
    name: string
    @IsNotEmpty()
    @IsUUID()
    establishment: string
    @IsArray()
    @ArrayMinSize(1, { message: 'Cada menú debe tener al menos un platillo' })
    @ValidateNested({ each: true, message: ' Cada platillo debe ser válido' })
    @Type(() => CreateDishDto)
    dishes: CreateDishDto[]
}