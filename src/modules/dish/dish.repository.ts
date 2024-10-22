import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDishDto } from 'src/dtos/dish/update-dish.dto';
import { Dish } from 'src/entities/dish.entity';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DishRepository {
  constructor(@InjectRepository(Dish) private dishRepository: Repository<Dish>, @InjectRepository(Menu_Category) private readonly menuCategoryRepository: Repository<Menu_Category>) { }

  async getDishById(id: string): Promise<undefined | Dish> {
    const foundDish: null | Dish = await this.dishRepository.findOneBy({ id });
    return foundDish === null ? undefined : foundDish;
  }

  async createDish(dishToCreate: CreateDishDto, category: Menu_Category): Promise<Dish> {
    const dish = this.dishRepository.create({ ...dishToCreate, category, });

    return await this.dishRepository.save(dish);
  }

  async updateDish(existingDish: Dish, modified_dish: UpdateDishDto) {
    Object.assign(existingDish, modified_dish);
    return await this.dishRepository.save(existingDish);
  }

  async deleteDish(dishToRemove: Dish): Promise<Dish> {
    return await this.dishRepository.remove(dishToRemove);
  }

  async getManyDishesById(ids: string[]): Promise<Dish[]> {
    const foundedDishes: Dish[] = await this.dishRepository.findBy({ id: In(ids) });
    return foundedDishes;
  }
}
