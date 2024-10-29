import { OmitType, PartialType } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "./register-restaurant.dto";

export class UpdateRestaurant extends PartialType(OmitType(RegisterRestaurantDto, ["future_manager"])) { }