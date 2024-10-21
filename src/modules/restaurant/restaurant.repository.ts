import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterRestaurantDto } from "src/dtos/restaurant/register-restaurant.dto";
import { Restaurant } from "src/entities/restaurant.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class RestaurantRepository {

    constructor(@InjectRepository(Restaurant) private restaurantRepository: Repository<Restaurant>) { }

    async getRestaurantById(id: string): Promise<Restaurant | undefined> {
        const found_restaurant: Restaurant | null = await this.restaurantRepository.findOne({ where: { id: id } })
        return found_restaurant === null ? undefined : found_restaurant;
    }

    async createRestaurant(future_manager: User, restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
        const saved_restaurant: Restaurant | null = await this.restaurantRepository.save(this.restaurantRepository.create({ ...restaurantObject, manager: future_manager }));
        return saved_restaurant === null ? undefined : saved_restaurant;
    }

}