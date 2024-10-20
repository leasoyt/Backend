import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuRepository {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) { }

  async createMenu(restaurant: Restaurant): Promise<Menu> {
    const newMenu = this.menuRepository.create({
      restaurant,  // Relacionamos el menú con el restaurante
      categories: [],  // Inicializamos la lista de categorías vacía
    });


    await this.menuRepository.save(newMenu);
    return newMenu;
  }

  async getMenuWithDishes(restaurant: Restaurant): Promise<Menu | undefined> {
    const menu = await this.menuRepository.findOne({
      where: { id: restaurant.menu.id },
      relations: ['categories', 'categories.dishes'],
    });

    if (!menu) {
      throw new NotFoundException(
        `Menu not found for restaurant with ID ${restaurant.id}`,
      );
    }

    return menu;
  }

  async deleteMenu(id: string) {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException('menu no encontrado');
    }
    return await this.menuRepository.delete(id);
  }

  async getMenuById(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['categories', 'restaurant'],
    });
    if (!menu) {
      throw new NotFoundException('menu no encontrado');
    }
    return menu;
  }
}
