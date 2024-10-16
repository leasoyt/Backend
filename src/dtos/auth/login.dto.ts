import { PickType } from "@nestjs/swagger";
import { RegisterUserDto } from "../gerente/registerUser.dto";

export class loginDto extends PickType(RegisterUserDto, [
    'email',
     'password',
  ] as const) {}