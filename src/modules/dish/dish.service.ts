/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDishDto } from 'src/dtos/dish/update-dish.dto';
import { DishRepository } from './dish.repository';
import { Dish } from 'src/entities/dish.entity';
import { DishDeletionMessage, DishDeletionResultDto, } from 'src/dtos/dish/delete-dish-result.dto';
import { OrderedDishesDto } from 'src/dtos/order/ordered_dishes.dto';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { MenuCategoryService } from '../menu_category/menu_category.service';

@Injectable()
export class DishService {

  constructor(private readonly dishRepository: DishRepository, private menu_category_service: MenuCategoryService) { }

  async getDishById(id: string): Promise<Dish> {
    const found_dish: Dish | undefined = await this.dishRepository.getDishById(id);

    if (found_dish === undefined) {
      throw new NotFoundException(`Failed to find dish with id: ${id}`);
    }

    return found_dish;
  }

  async createDish(dishToCreate: CreateDishDto): Promise<Omit<Dish, "category">> {
    const found_category: Menu_Category = await this.menu_category_service.getCategoryAndDishes(dishToCreate.category);
    const dishExists = found_category.dishes.some((dish: Dish) => dish.name === dishToCreate.name);

    if (dishExists) {
      throw new ConflictException("there is already a dish with that name");
    }

    const {category, ...no_relations_dish} = await this.dishRepository.createDish(dishToCreate, found_category);
    return no_relations_dish;
  }

  async updateDish(id: string, modified_dish: UpdateDishDto): Promise<Dish> {
    const existingDish: Dish = await this.getDishById(id);

    if (modified_dish.category) {
      const found_category: Menu_Category = await this.menu_category_service.getCategoryAndDishes(modified_dish.category);
      if (!found_category) {
        throw new NotFoundException(`Category with ID ${modified_dish.category} not found`);
      }
    }

    return this.dishRepository.updateDish(existingDish, modified_dish)
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
  }

  async getManyDishesById(dishes: OrderedDishesDto[]): Promise<Dish[]> {
    const dishesId: string[] = dishes.map((dish) => dish.id);
    const foundedDishes: Dish[] = await this.dishRepository.getManyDishesById(dishesId);

    const notFoundedDishes: string[] = dishesId.filter((dish) =>
      !foundedDishes.map((foundedDish) => foundedDish.id).includes(dish));

    if (notFoundedDishes.length)
      throw new BadRequestException(
        `No se pudieron encontrar los siguientes platillos: ${notFoundedDishes}`
      );
    return foundedDishes;
  }
}