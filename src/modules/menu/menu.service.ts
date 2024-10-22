import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async getMenuCategories(): Promise<Menu> {
    return new Menu();
  }

  async getMenuWithDishes(restaurantId: string): Promise<Menu> {
    const found_restaurant: Restaurant =
      await this.restaurantService.getRestaurantById(restaurantId);
    return this.menuRepository.getMenuWithDishes(found_restaurant);
  }

  async getMenuByRestaurantId(id: string) {
    const restaurant: Restaurant = await this.restaurantService.getRestaurantById(id);
    const menu: Menu | undefined = await this.menuRepository.getMenuByRestaurant(restaurant);

    if(menu === undefined) {
      throw new NotFoundException("Can't find menu for this establishment");
    }

    return menu;
  }
}
