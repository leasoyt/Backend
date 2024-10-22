import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "../auth/register.dto";
import { IsString } from "class-validator";

export class UpdatePasswordDto extends PickType(RegisterDto, ["password", "confirmPassword"]) {
    @IsString()
    old_password: string;
}