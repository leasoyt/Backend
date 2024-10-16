import { IsNotEmpty, IsString } from "class-validator";

export class AdditionalEmployeeInfo {
    @IsString()
    @IsNotEmpty()
    rol: string
}