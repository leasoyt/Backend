import { PartialType } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "./register-restaurant.dto";

export class UpdateRestaurant extends PartialType(RegisterRestaurantDto){}