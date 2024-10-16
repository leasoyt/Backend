import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class AditionalInfoRegisterClient {
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    phoneNumber: string
}