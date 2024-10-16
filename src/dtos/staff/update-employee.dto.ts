import { PartialType } from "@nestjs/swagger";
import { RegisterEmployeeDto } from "./register-employee.dto";

export class UpdateEmployeeDto extends PartialType(RegisterEmployeeDto) {}