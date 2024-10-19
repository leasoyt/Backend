import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDto } from 'src/dtos/menu/create-menu.dto';
import { Menu } from 'src/entities/menu.entity';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuRepository {
  
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,  @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>
  ) {}

  async createMenu(menu:CreateMenuDto,restaurantId:string){
    const restaurant = await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant) {
      throw new HttpException('Restaurante no encontrado', HttpStatus.NOT_FOUND);
    }

    const newMenu = await this.menuRepository.save({...menu,restaurant:restaurant});

    return newMenu;


  }


  getMenu(restaurantId: string) {
   
}


  async updateMenu(){

  }

  async addDish(){

  }
}
