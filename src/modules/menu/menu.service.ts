import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Menu } from 'src/entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository, @Inject(forwardRef(() => RestaurantService)) private restaurantService: RestaurantService) { }

  async createMenu(restaurantId: string): Promise<Menu> {
    const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
    return this.menuRepository.createMenu(restaurant);
  }

  async getMenuWithDishes(restaurantId: string): Promise<Menu> {
    const found_restaurant: Restaurant =
      await this.restaurantService.getRestaurantById(restaurantId);
    return this.menuRepository.getMenuWithDishes(found_restaurant);
  }

  deleteMenu(id: string) {
    return this.menuRepository.deleteMenu(id);
  }

  getMenuById(id: string) {
    return this.menuRepository.getMenuById(id);
  }
}
