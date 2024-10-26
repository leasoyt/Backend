import { IsNumber } from "class-validator";
import { Restaurant } from "src/entities/restaurant.entity";

export class RestaurantQueryManyDto {
    @IsNumber()
    items: number;
    
    @IsNumber()
    page: number;

    @IsNumber()
    limit: number;

    @IsNumber()
    total_pages: number;

    restaurants: Restaurant[]
}