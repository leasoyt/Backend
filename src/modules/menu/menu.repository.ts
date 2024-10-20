import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuRepository {

  constructor(@InjectRepository(Menu) private menuRepository: Repository<Menu>) { }

  async createMenu(restaurant: Restaurant): Promise<Menu> {
    const newMenu: Menu = this.menuRepository.create({ restaurant: restaurant });
    return await this.menuRepository.save(newMenu);
  }

  async getMenu(id: string): Promise<Menu | undefined> {
    const found_menu: Menu | null = await this.menuRepository.findOne({ where: { id: id } });
    return found_menu === null ? undefined : found_menu;
  }
  
}
