import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Menu_Category_Repository {
  constructor(@InjectRepository(Menu_Category) private menu_Category_Repository: Repository<Menu_Category>) { }

  async createMenuCategory(menu_category_name: string, menuInstance: Menu,): Promise<Menu_Category> {
    const newMenuCategory = this.menu_Category_Repository.create({ name: menu_category_name, menu: menuInstance });
    return await this.menu_Category_Repository.save(newMenuCategory);
  }

  async deleteMenuCategory(menu_categoryInstance: Menu_Category): Promise<Menu_Category | undefined> {
    const menu_category: Menu_Category | null = await this.menu_Category_Repository.remove(menu_categoryInstance);
    return menu_category === null? undefined : menu_category;
  }

  async getCategoryAndDishes(id: string): Promise<Menu_Category | undefined> {
    const menu_category: Menu_Category | null = await this.menu_Category_Repository.findOne({ where: { id }, relations: { dishes: true } });

    return menu_category === null? undefined : menu_category;
  }

}

