import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { Restaurant } from 'src/entities/restaurant.entity';
import { RegisterRestaurantDto } from 'src/dtos/restaurant/register-restaurant.dto';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { UpdateRestaurant } from 'src/dtos/restaurant/updateRestaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly userService: UserService,
  ) {}

  async getRestaurantById(id: string): Promise<Restaurant> {
    const found_restaurant: Restaurant | undefined =
      await this.restaurantRepository.getRestaurantById(id);

    if (found_restaurant === undefined) {
      throw new NotFoundException(`Failed to find restaurant with id: ${id}`);
    }

    return found_restaurant;
  }

  async deleteRestaurant(id: string): Promise<void> {
    return this.restaurantRepository.deleteRestaurant(id);
  }

  async createRestaurant(
    userId: string,
    restaurantObject: RegisterRestaurantDto,
  ): Promise<Restaurant> {
    const future_manager: User = await this.userService.rankUpTo(
      restaurantObject.future_manager,
      UserRole.MANAGER,
    );
    const created_restaurant: Restaurant | undefined =
      await this.restaurantRepository.createRestaurant(
        future_manager,
        restaurantObject,
      );

    return await this.getRestaurantById(created_restaurant.id);
  }

  async updateRestaurant(
    id: string,
    updateData: UpdateRestaurant,
  ): Promise<any> {
    return this.restaurantRepository.updateRestaurant(id, updateData);
  }

  async getRestaurantsQuery(
    page: number,
    limit: number,
    rating?: number,
    search?: string,
  ) {
    return this.restaurantRepository.getRestaurantsQuery(
      page,
      limit,
      rating,
      search,
    );
  }
}
