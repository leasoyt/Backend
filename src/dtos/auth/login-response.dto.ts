import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";
import { IsEnum, IsNotEmpty, IsString, IsUUID, NotContains, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { HttpMessagesEnum } from "../../enums/httpMessages.enum";
import { UserRole } from "src/enums/roles.enum";

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

class InnerResponseInfo extends PickType(RegisterDto, ["name", "email", "country", "profile_image"] as const){

    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
 }