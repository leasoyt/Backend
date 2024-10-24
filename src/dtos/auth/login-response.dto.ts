import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";
import { IsNotEmpty, IsString, NotContains, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { HttpMessagesEnum } from "../custom-responses.dto";

/**
 * Dto: Respuesta de logueo exitoso
 */
export class LoginResponseDto {
    @IsNotEmpty()
    @IsString()
    message: HttpMessagesEnum.LOGIN_SUCCESS | HttpMessagesEnum.LOGIN_FAIL;

    @IsNotEmpty()
    @IsString()
    @NotContains(" ")
    token: string;

    @ValidateNested()
    @Type(() => InnerResponseInfo)
    user: InnerResponseInfo;
}

class InnerResponseInfo extends PickType(RegisterDto, ["name", "email", "country", "profile_image"] as const){ }