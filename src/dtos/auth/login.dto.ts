import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";

/**
 * Dto: Login de usuarios en general
 */
export class LoginDto extends PickType(RegisterDto, ['email', 'password',] as const) { }