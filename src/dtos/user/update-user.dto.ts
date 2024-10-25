import { PartialType } from "@nestjs/swagger";
import { RegisterDto } from "../auth/register.dto";

/**
 * Dto: Update de user, todos los campos opcionales.
 */
export class UpdateUserDto extends PartialType(RegisterDto){}