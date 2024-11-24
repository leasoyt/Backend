import { OmitType } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "./register-restaurant.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateRestaurant extends OmitType(RegisterRestaurantDto, ["future_manager"]) { 
    @IsOptional()
    @IsBoolean()
    was_hidden: boolean;
}