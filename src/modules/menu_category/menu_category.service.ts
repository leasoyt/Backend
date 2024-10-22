/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu_Category_Repository } from './menu_category.repository';
import { MenuService } from '../menu/menu.service';
import { CreateMenuCategoryDto } from 'src/dtos/menu/menu_category.dto';
import { Menu } from 'src/entities/menu.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { MenuCategoryDeletionMessage, MenuCategoryDeletionResult } from 'src/dtos/menu/delete-menu-category.dto';

@Injectable()
export class MenuCategoryService {
  constructor(private readonly menu_category_reposiroty: Menu_Category_Repository, private readonly menuService: MenuService, private readonly restaurantService: RestaurantService) { }

  async createMenuCategory(menuCategory: CreateMenuCategoryDto) {
    const found_menu: Menu = await this.menuService.getMenuByRestaurantId(menuCategory.restaurant_id);
    const { menu, ...no_relations_menu } = await this.menu_category_reposiroty.createMenuCategory(menuCategory.name, found_menu);
    return no_relations_menu;
  }

  async deleteMenuCategory(id: string): Promise<MenuCategoryDeletionResult> {
    const deleted_category: Menu_Category = await this.menu_category_reposiroty.deleteMenuCategory(await this.getCategoryAndDishes(id));

    if (deleted_category === undefined) {
      return { message: MenuCategoryDeletionMessage.FAILED };
    }

    return { message: MenuCategoryDeletionMessage.SUCCESSFUL };
  }

  // async getCategories(id: string) {
  //   const found_menu: Menu = await this.menuService.getMenuByRestaurantId(id)

  //   if (!found_menu.categories || found_menu.categories.length === 0) {
  //     throw new NotFoundException(`No categories found for menu with ID ${id}`);
  //   }

  //   return await this.menu_category_reposiroty.getCategories(found_menu)
  // }

  async getCategoryAndDishes(id: string): Promise<Menu_Category> {
    const found_category: Menu_Category | undefined = await this.menu_category_reposiroty.getCategoryAndDishes(id);
    if(found_category === undefined) {
      throw new NotFoundException("can't find this category");
    }

    return found_category;
  }
}


