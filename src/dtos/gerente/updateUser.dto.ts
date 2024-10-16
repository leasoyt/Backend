import { OmitType, PartialType } from "@nestjs/swagger";
import { RegisterUserDto } from "./registerUser.dto";

export class UpdateUserDto extends PartialType(OmitType(RegisterUserDto, ['confirmPassword', 'establishment'] as const)){}