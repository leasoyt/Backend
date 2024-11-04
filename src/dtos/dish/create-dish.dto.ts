import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Length } from "class-validator"

export class CreateDishDto {
    @IsNotEmpty()
    @Length(3, 50)
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsDecimal()
    price: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUrl()
    imgUrl?: string;

    @IsNotEmpty()
    @IsUUID()
    category: string;
}