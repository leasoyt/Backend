import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuRepository {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>) { }

  async createMenu(restaurant: Restaurant): Promise<Menu> {
    const newMenu = this.menuRepository.create({ restaurant, categories: [] });
    return await this.menuRepository.save(newMenu);
  }

  async getMenuByRestaurant(restaurantInstance: Restaurant, categories: boolean): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findOne({
      where: { restaurant: restaurantInstance },
      relations: categories ? ['categories'] : null,
    });

    return menu === null ? undefined : menu;
  }
}
