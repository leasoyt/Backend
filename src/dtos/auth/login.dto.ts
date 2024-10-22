import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";
import { IsNotEmpty, IsString, Length } from "class-validator";

/**
 * Dto: Login de usuarios en general
 */
export class LoginDto extends PickType(RegisterDto, ['email'] as const) { 
    
    @IsNotEmpty()
    @IsString()
    @Length(8, 80)
    password: string;
}