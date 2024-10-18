import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches, Validate, ValidateNested } from "class-validator"
import { RegisterEstablishmentDto } from "../establisment/register-establishment.dto"
import { Type } from "class-transformer"
import { MatchPassword } from "src/validators/matchPassword.validator"

/**
 * Dto: Registro de usuarios en general
 */
export class RegisterDto {
    @IsNotEmpty()
    @Length(3, 80)
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
        {
            message:
                'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*), and be between 8 and 15 characters long.',
        },
    )
    password: string;

    @IsNotEmpty()
    @IsString()
    @Validate(MatchPassword, ["password"])
    confirmPassword: string;

    @IsOptional()
    @IsUrl()
    profile_image?: string;

    @IsOptional()
    @Length(3, 50)
    country?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => RegisterEstablishmentDto)
    establishment?: RegisterEstablishmentDto;
}