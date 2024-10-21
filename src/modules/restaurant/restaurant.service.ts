import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RestaurantRepository } from "./restaurant.repository";
import { Restaurant } from "src/entities/restaurant.entity";
import { RegisterRestaurantDto } from "src/dtos/restaurant/register-restaurant.dto";
import { UserService } from "../user/user.service";
import { MenuService } from "../menu/menu.service";
import { UserRole } from "src/enums/roles.enum";
import { User } from "src/entities/user.entity";

@Injectable()
export class RestaurantService {

    constructor(private readonly restaurantRepository: RestaurantRepository, private readonly userService: UserService, @Inject(forwardRef(() => MenuService)) private menuService: MenuService) { }

    async getRestaurantById(id: string): Promise<Restaurant> {
        const found_restaurant: Restaurant | undefined = await this.restaurantRepository.getRestaurantById(id);

        if (found_restaurant === undefined) {
            throw new NotFoundException(`Failed to find restaurant with id: ${id}`);
        }

        return found_restaurant;
    }

    async createRestaurant(restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
        const future_manager: User = await this.userService.rankUpTo(restaurantObject.future_manager, UserRole.MANAGER);
        const created_restaurant: Restaurant | undefined = await this.restaurantRepository.createRestaurant(future_manager, restaurantObject);
        await this.menuService.createMenu(created_restaurant.id);
        return await this.getRestaurantById(created_restaurant.id);
    }

    async updateRestaurant(): Promise<any> {
        return null;
    }

}