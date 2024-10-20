import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";
import { IsNotEmpty, IsString, Length, NotContains, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

/**
 * Dto: Respuesta de logueo exitoso
 */
export class LoginResponseDto {
    @IsNotEmpty()
    @Length(5, 100)
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    @NotContains(" ")
    token: string;

    @ValidateNested()
    @Type(() => InnerResponseInfo)
    user: InnerResponseInfo;
}

class InnerResponseInfo extends PickType(RegisterDto, ["name", "email", "country", "profile_image"] as const){ }