import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDish } from 'src/dtos/dish/update-dish.dto';
import { DishRepository } from './dish.repository';
import { Dish } from 'src/entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
   
  ) {}
  async getDishByName(name: string): Promise<Dish | null> {
    try {
      const foundDish: Dish | null =
        await this.dishRepository.getDishByName(name);
      return foundDish;
    } catch (error) {
      throw new BadRequestException(
        `Error al buscar el platillo ${error.message}`,
      );
    }
  }
  async getDishById(id: string): Promise<Dish | null> {
    try {
      const foundDish: Dish | null = await this.dishRepository.getDishById(id);
      return foundDish;
    } catch (error) {
      throw new BadRequestException(
        `Error al buscar el platillo ${error.message}`,
      );
    }
  }

  createDish(dishToCreate: CreateDishDto,menuId:string) {
    return this.dishRepository.createDish(dishToCreate,menuId);
  }

  async updateDish(id: string, modified_dish: UpdateDish): Promise<Dish> {
    const existingDish: null | Dish = await this.getDishById(id);
    if (!existingDish)
      throw new BadRequestException(
        'El plato que se desea actualizar no existe',
      );
    try {
      const updatedDish: Dish = await this.dishRepository.updateDish(
        existingDish,
        modified_dish,
      );
      return updatedDish;
    } catch (error) {
      throw new BadRequestException(
        `Error al actualizar el platillo ${error.message}`,
      );
    }
  }
  async deleteDish(id: string) {
    const existingDish: null | Dish = await this.getDishById(id);
    if (!existingDish)
      throw new BadRequestException('El plato que se desea eliminar no existe');
    try {
      const deletedDish = await this.dishRepository.deleteDish(existingDish);
      return deletedDish;
    } catch (error) {
      throw new BadRequestException(
        `Error al eliminar el platillo ${error.message}`,
      );
    }
  }
}
