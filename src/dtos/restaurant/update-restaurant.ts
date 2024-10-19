import { IntersectionType, PartialType } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "./register-restaurant.dto";
import { AditionalEstablishmentInfo } from "./aditional-establishment-info";

export class UpdateRestaurantDto extends PartialType(IntersectionType(RegisterRestaurantDto, AditionalEstablishmentInfo)) { }