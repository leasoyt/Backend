import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "../auth/register.dto";

export class UpdatePasswordDto extends PickType(RegisterDto, ["password", "confirmPassword"]) {
    old_password: string;
}