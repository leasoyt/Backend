import { IntersectionType, OmitType } from "@nestjs/swagger";
import { RegisterDto } from "../auth/register.dto";
import { AdditionalEmployeeInfo } from "./aditional-employee-info.dto";

export class RegisterEmployeeDto extends IntersectionType(OmitType(RegisterDto, ['email'] as const), AdditionalEmployeeInfo) {}