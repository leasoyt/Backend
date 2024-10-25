import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { Restaurant } from 'src/entities/restaurant.entity';
import { RegisterRestaurantDto } from 'src/dtos/restaurant/register-restaurant.dto';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { UpdateRestaurant } from 'src/dtos/restaurant/updateRestaurant.dto';
import { MenuService } from '../menu/menu.service';
import { HttpResponseDto } from 'src/dtos/http-response.dto';
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { HandleError } from 'src/decorators/generic-error.decorator';

@Injectable()
export class RestaurantService {

  constructor(private readonly restaurantRepository: RestaurantRepository, private readonly userService: UserService, @Inject(forwardRef(() => MenuService)) private readonly menuService: MenuService) { }

  @HandleError(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
  async getRestaurantById(id: string): Promise<Restaurant> {
    const found_restaurant: Restaurant | undefined = await this.restaurantRepository.getRestaurantById(id);

    if (found_restaurant === undefined) {
      throw { error: "Restaurant not found" };
    }

    return found_restaurant;
  }

  @HandleError(HttpMessagesEnum.RESTAURANT_DELETION_FAILED, InternalServerErrorException)
  async deleteRestaurant(id: string): Promise<HttpResponseDto> {
    const found_restaurant: Restaurant = await this.getRestaurantById(id);
    const was_deleted: boolean = await this.restaurantRepository.deleteRestaurant(found_restaurant);

    if (!was_deleted) {
      throw { error: "Something went wrong" };
    }

    return { message: HttpMessagesEnum.RESTAURANT_DELETION_SUCCESS };
  }

  async createRestaurant(restaurantObject: RegisterRestaurantDto,): Promise<Restaurant> {
    try {
      const future_manager: User = await this.userService.rankUpTo(restaurantObject.future_manager, UserRole.MANAGER);
      const created_restaurant: Restaurant | undefined = await this.restaurantRepository.createRestaurant(future_manager, restaurantObject);

      await this.menuService.createMenu(created_restaurant.id);

      return await this.getRestaurantById(created_restaurant.id);
    } catch (err) {
      throw new InternalServerErrorException({ message: HttpMessagesEnum.RESTAURANT_CREATION_FAILED, error: err?.error });
    }
  }

  async updateRestaurant(id: string, updateData: UpdateRestaurant): Promise<Restaurant> {
    const found_restaurant: Restaurant = await this.getRestaurantById(id);
    return this.restaurantRepository.updateRestaurant(found_restaurant, updateData);
  }

  async getRestaurantsQuery(page: number, limit: number, rating?: number, search?: string) {
    return this.restaurantRepository.getRestaurantsQuery(page, limit, rating, search);
  }
}
