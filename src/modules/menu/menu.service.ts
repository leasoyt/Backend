import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Menu } from 'src/entities/menu.entity';
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";

@Injectable()
export class MenuService {

  constructor(private readonly menuRepository: MenuRepository, @Inject(forwardRef(() => RestaurantService)) private restaurantService: RestaurantService) { }

  async createMenu(): Promise<Menu> {
    try {
      // const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
      return this.menuRepository.createMenu();
    } catch (err) {
      throw err?.message || { error: "Menu creation failed" };
    }
  }

  async updateMenu(created_menu: Menu, created_restaurant: Restaurant) {
    await this.menuRepository.updateMenu(created_menu, created_restaurant);
  }

  @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
  async getMenuWithCategories(restaurantId: string): Promise<Menu> {
    const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
    const found_menu: Menu | undefined = await this.menuRepository.getMenuByRestaurant(restaurant, true);

    if (found_menu === undefined) {
      throw { error: "Menu with categories can't be found" }
    }

    return found_menu;
  }

  async getMenuByRestaurantId(id: string): Promise<Menu> {
    const restaurant: Restaurant = await this.restaurantService.getRestaurantById(id);
    const menu: Menu | undefined = await this.menuRepository.getMenuByRestaurant(restaurant, false);

    if (menu === undefined) {
      throw { error: "Menu not found", exception: NotFoundException };
    }

    return menu;
  }

}
