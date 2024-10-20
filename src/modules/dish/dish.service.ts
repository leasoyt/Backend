import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDishDto } from 'src/dtos/dish/update-dish.dto';
import { DishRepository } from './dish.repository';
import { Dish } from 'src/entities/dish.entity';

import {
  DishDeletionMessage,
  DishDeletionResultDto,
} from 'src/dtos/dish/delete-dish-result.dto';
import { OrderedDishesDto } from 'src/dtos/order/ordered_dishes.dto';

@Injectable()
export class DishService {
  constructor(private readonly dishRepository: DishRepository) { }


  async getDishById(id: string): Promise<Dish> {
    const found_dish: Dish | undefined =
      await this.dishRepository.getDishById(id);

    if (found_dish === undefined) {
      throw new NotFoundException(`Failed to find Dish with id: ${id}`);
    }

    return found_dish;
  }

   createDish(dishToCreate: CreateDishDto,categoryId:string): Promise<Dish> {
    return this.dishRepository.createDish(dishToCreate,categoryId)

  }
    

  async updateDish(id: string, modified_dish: UpdateDishDto): Promise<Dish> {
    const existingDish: Dish = await this.getDishById(id);

    try {
      const updatedDish: Dish = await this.dishRepository.updateDish(
        existingDish,
        modified_dish,
      );
      return updatedDish;
    } catch (err) {
      throw new BadRequestException(
        `Error al actualizar el platillo ${err.message}`,
      );
    }
  }

  async deleteDish(id: string): Promise<DishDeletionResultDto> {
    const existing_dish: Dish = await this.getDishById(id);

    try {
      await this.dishRepository.deleteDish(existing_dish);
      return { message: DishDeletionMessage.SUCCESSFUL };
    } catch (err) {
      throw new InternalServerErrorException({
        message: DishDeletionMessage.FAILED,
        error: err,
      });
    }

  async getDishesByIds(dishes: OrderedDishesDto[]): Promise<Dish[]> {
    const dishesId: string[] = dishes.map((dish) => dish.id);
    const foundedDishes: Dish[] =
      await this.dishRepository.getDishesByIds(dishesId);
    const notFoundedDishes: string[] = dishesId.filter(
      (dish) =>
        !foundedDishes.map((foundedDish) => foundedDish.id).includes(dish),
    );
    if (notFoundedDishes)
      throw new BadRequestException(
        `No se pudieron encontrar los siguientes platillos: ${notFoundedDishes}`,
      );
    return foundedDishes;
  }
}
