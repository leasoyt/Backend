import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDish } from 'src/dtos/dish/update-dish.dto';
import { Dish } from 'src/entities/dish.entity';
import { Menu } from 'src/entities/menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DishRepository {
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>, @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>
  ) {}

  async getDishByName(name: string): Promise<null | Dish> {
    const foundDish: null | Dish = await this.dishRepository.findOneBy({
      name,
    });
    return foundDish;
  }
  async getDishById(id: string): Promise<null | Dish> {
    const foundDish: null | Dish = await this.dishRepository.findOneBy({ id });
    return foundDish;
  }


  async createDish(dishToCreate: CreateDishDto,menuId:string) {


    const menu = await this.menuRepository.findOne({
        where: { id: menuId },
        relations: ['dishes'], 
      });
      if (!menu) {
        throw new NotFoundException('Menú no encontrado');
      }

    const existingDish = await this.dishRepository.findOne({
      where: {
        name: dishToCreate.name,
      },
    });
    if (existingDish) {
      throw new HttpException(
        'Nombre de platillo repetido',
        HttpStatus.CONFLICT,
      );
    }

    const newDish = this.dishRepository.create(dishToCreate);

    newDish.menu=menu

    const savedDish = await this.dishRepository.save(newDish);


    menu.dishes.push(savedDish);
    await this.menuRepository.save(menu);

    return savedDish;
  }


  
  async updateDish(
    existingDish: Dish,
    dish_to_modify: UpdateDish,
  ): Promise<Dish> {
    const dishToUpdate: Dish = this.dishRepository.merge(
      existingDish,
      dish_to_modify,
    );
    return this.dishRepository.save(dishToUpdate);
  }
  async deleteDish(dishToRemove: Dish) {
    return this.dishRepository.remove(dishToRemove);
  }
}
