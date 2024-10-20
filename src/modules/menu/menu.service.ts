import { Injectable, NotFoundException } from "@nestjs/common";
import { MenuRepository } from "./menu.repository";
import { RestaurantService } from "../restaurant/restaurant.service";
import { Restaurant } from "src/entities/restaurant.entity";
import { Menu } from "src/entities/menu.entity";

@Injectable()
export class MenuService {

   constructor(private readonly menuRepository: MenuRepository, private readonly restaurantService: RestaurantService) { }

   async createMenu(restaurantId: string): Promise<Menu> {
      const found_restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
      return this.menuRepository.createMenu(found_restaurant);
   }

   async getMenu(id: string): Promise<Menu> {
      const menu: Menu | undefined = await this.menuRepository.getMenu(id);

      if(menu === undefined) {
         throw new NotFoundException(`Failed to find menu with the provided id: ${id}`);
      }
      return menu;
   }

}