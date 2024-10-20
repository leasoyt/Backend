import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDishDto } from 'src/dtos/dish/update-dish.dto';
import { Dish } from 'src/entities/dish.entity';
import { Menu } from 'src/entities/menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DishRepository {

  constructor(@InjectRepository(Dish) private dishRepository: Repository<Dish>) { }

  async getDishById(id: string): Promise<undefined | Dish> {
    const foundDish: null | Dish = await this.dishRepository.findOneBy({ id });
    return foundDish === null ? undefined : foundDish;
  }

  async createDish(dishToCreate: CreateDishDto, menu: Menu): Promise<Dish> {
    const created_dish: Dish = this.dishRepository.create({ ...dishToCreate, menu: menu });
    return await this.dishRepository.save(created_dish);
  }

  async updateDish(existingDish: Dish, dish_to_modify: UpdateDishDto): Promise<Dish> {
    const dishToUpdate: Dish = this.dishRepository.merge(existingDish, dish_to_modify);
    return this.dishRepository.save(dishToUpdate);
  }

  async deleteDish(dishToRemove: Dish): Promise<Dish> {
    return await this.dishRepository.remove(dishToRemove);
  }

}
