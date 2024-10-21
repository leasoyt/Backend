import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu_Category_Repository } from './menu_category.repository';
import { MenuService } from '../menu/menu.service';
import { CreateMenuCategoryDto } from 'src/dtos/menu/menu_category.dto';
import { Menu } from 'src/entities/menu.entity';

@Injectable()
export class MenuCategoryService {
  constructor(
    private readonly menu_category_reposiroty: Menu_Category_Repository,
    private readonly menuService: MenuService,
  ) {}

  async createMenuCategory(menuCategory: CreateMenuCategoryDto) {
    const found_menu:Menu=await this.menuService.getMenuById(menuCategory.menuId)
    return this.menu_category_reposiroty.createMenuCategory(menuCategory,found_menu)
  }


   deleteMenuCategory(id:string){
    return this.menu_category_reposiroty.delteMenuCategory(id)
  }


  async getCategories(id:string){
    const found_menu:Menu=await this.menuService.getMenuById(id)

    if (!found_menu.categories || found_menu.categories.length === 0) {
        throw new NotFoundException(`No categories found for menu with ID ${id}`);
      }

    return await this.menu_category_reposiroty.getCategories(found_menu)
  }
}
