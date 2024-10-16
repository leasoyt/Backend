import { IntersectionType, OmitType } from "@nestjs/swagger";
import { RegisterUserDto } from "../gerente/registerUser.dto";
import { AdditionalEmployeeInfo } from "./aditional-employee-info.dto";

export class RegisterEmployeeDto extends IntersectionType(OmitType(RegisterUserDto, ['establishment', 'email'] as const), AdditionalEmployeeInfo) {}