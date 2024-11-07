import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthRequestDto {

    @IsNotEmpty()
    name: string;

    @IsOptional()
    picture: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    sub: string;
}
