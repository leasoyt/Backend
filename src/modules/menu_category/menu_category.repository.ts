import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuCategoryDto } from 'src/dtos/menu/menu_category.dto';
import { Menu } from 'src/entities/menu.entity';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Menu_Category_Repository {
  constructor(@InjectRepository(Menu_Category) private menu_Category_Repository: Repository<Menu_Category>) { }

  async createMenuCategory(menu_category: CreateMenuCategoryDto, menu: Menu,): Promise<Menu_Category> {
    const newMenuCategory = this.menu_Category_Repository.create({ ...menu, menu, });
    return await this.menu_Category_Repository.save(newMenuCategory);
  }

  async delteMenuCategory(id: string) {
    const menu = await this.menu_Category_Repository.findOneBy({ id });
    if (!menu) throw new NotFoundException('categoria no encontrada');
    return await this.menu_Category_Repository.remove(menu);
  }

  async getCategories(found_menu: Menu): Promise<Menu_Category[]> {
    return await this.menu_Category_Repository.find({ where: { menu: found_menu }, relations: ['dishes'] })
  }

  async getCategorieById(id: string) {
    const menu_category = await this.menu_Category_Repository.findOne({ where: { id }, relations: { dishes: true } });

    if (!menu_category)
      throw new HttpException('Category Not found', HttpStatus.NOT_FOUND);

    return menu_category;
  }

}

