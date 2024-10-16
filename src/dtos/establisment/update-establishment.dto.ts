import { IntersectionType, PartialType } from "@nestjs/swagger";
import { RegisterEstablishmentDto } from "./register-establishment.dto";
import { AditionalEstablishmentInfo } from "./aditional-establishment-info";

export class UpdateEstablishment extends PartialType(IntersectionType(RegisterEstablishmentDto, AditionalEstablishmentInfo)){}