import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Length } from "class-validator"

export class CreateDishDto {
    @IsNotEmpty()
    @Length(3, 50)
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber() 
    price: number;

    @IsOptional()
    @IsString()
    @Length(8, 100)
    description?: string;

    @IsOptional()
    @IsUrl()
    dish_image?: string;

    @IsNotEmpty()
    @IsUUID()
    menu_category: string;
}