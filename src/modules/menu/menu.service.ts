import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Menu } from 'src/entities/menu.entity';
import { CreateMenuDto } from 'src/dtos/menu/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createMenu(menu:CreateMenuDto): Promise<Menu> {
    const found_restaurant: Restaurant =
      await this.restaurantService.getRestaurantById(menu.restaurantId);
    return this.menuRepository.createMenu(menu,found_restaurant);
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
