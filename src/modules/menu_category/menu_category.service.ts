/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Menu_Category_Repository } from './menu_category.repository';
import { MenuService } from '../menu/menu.service';
import { CreateMenuCategoryDto } from 'src/dtos/menu/menu_category.dto';
import { Menu } from 'src/entities/menu.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { HttpResponseDto } from 'src/dtos/http-response.dto';
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';

@Injectable()
export class MenuCategoryService {
  constructor(private readonly menuCategoryRepository: Menu_Category_Repository, private readonly menuService: MenuService, private readonly restaurantService: RestaurantService) { }

  @TryCatchWrapper(HttpMessagesEnum.MENU_CATEGORY_CREATION_FAILED, BadRequestException)
  async createMenuCategory(menuCategory: CreateMenuCategoryDto): Promise<Omit<Menu_Category, "menu">> {

      const found_menu: Menu = await this.menuService.getMenuByRestaurantId(menuCategory.restaurant_id);
      const { menu, ...no_relations_menu } = await this.menuCategoryRepository.createMenuCategory(menuCategory.name, found_menu);
  
      return no_relations_menu;
  }

  @TryCatchWrapper(HttpMessagesEnum.MENU_CATEGORY_DELETE_FAILED, BadRequestException)
  async deleteMenuCategory(id: string): Promise<HttpResponseDto> {

      const deleted_category: Menu_Category = await this.menuCategoryRepository.deleteMenuCategory(await this.getCategoryAndDishes(id));

      if (deleted_category instanceof Menu_Category) {
        return { message: HttpMessagesEnum.MENU_CATEGORY_DELETE_SUCCESS };
      }

      throw { error: "Something went wrong" };
  }

  async getCategoryAndDishes(id: string): Promise<Menu_Category> {
    const found_category: Menu_Category | undefined = await this.menuCategoryRepository.getCategoryAndDishes(id);
    if (found_category === undefined) {
      throw { error: "Category not found", exception: NotFoundException };
    }

    return found_category;
  }

}


