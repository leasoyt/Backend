import { IntersectionType, OmitType } from "@nestjs/swagger";
import { RegisterUserDto } from "../gerente/registerUser.dto";
import { AditionalInfoRegisterClient } from "./aditionalInfoRegisterClient.dto";

export class RegisterClientDot extends IntersectionType(OmitType(RegisterUserDto, ['confirmPassword', 'establishment'] as const), AditionalInfoRegisterClient){}