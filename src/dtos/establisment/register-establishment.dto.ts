import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class RegisterEstablishmentDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    name: string
    @IsNotEmpty()
    @IsString()
    @Length(10, 500)
    description: string
    @IsOptional()
    @IsUrl()
    establishment_img?: string
}