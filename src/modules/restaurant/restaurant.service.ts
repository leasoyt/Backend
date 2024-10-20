import { Injectable, NotFoundException } from "@nestjs/common";
import { RestaurantRepository } from "./restaurant.repository";
import { Restaurant } from "src/entities/restaurant.entity";

@Injectable()
export class RestaurantService {
    constructor(private readonly restaurantRepository: RestaurantRepository){}

    async getRestaurantById(id: string): Promise<Restaurant> {
        const found_restaurant: Restaurant | undefined = await this.restaurantRepository.getRestaurantById(id);

        if(found_restaurant === undefined) {
            throw new NotFoundException(`Failed to find restaurant with id: ${id}`);
        }

        return found_restaurant;
    }

}