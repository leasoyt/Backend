import { IntersectionType, OmitType } from "@nestjs/swagger";
import { RegisterUserDto } from "../gerente/registerUser.dto";
import { AditionalInfoRegisterClient } from "./aditionalInfoRegisterClient.dto";

export class RegisterClientDto extends IntersectionType(OmitType(RegisterUserDto, ['establishment'] as const), AditionalInfoRegisterClient){}