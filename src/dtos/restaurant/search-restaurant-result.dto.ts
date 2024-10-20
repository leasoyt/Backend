import { PickType } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "./register-restaurant.dto";

export class SearchRestaurantResultDto extends PickType(RegisterRestaurantDto, ["name", "imgUrl"]){

}