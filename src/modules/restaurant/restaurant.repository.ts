import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/entities/restaurant.entity";
import { Repository } from "typeorm";

@Injectable()
export class RestaurantRepository {
    constructor(@InjectRepository(Restaurant) private restaurantRepository: Repository<Restaurant>) { }

    async getRestaurantById(id: string): Promise<Restaurant | undefined> {
        const found_restaurant: Restaurant | null = await this.restaurantRepository.findOne({ where: { id: id } })
        return found_restaurant === null ? undefined : found_restaurant;
    }
}