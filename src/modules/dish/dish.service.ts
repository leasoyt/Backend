/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDishDto } from 'src/dtos/dish/update-dish.dto';
import { DishRepository } from './dish.repository';
import { Dish } from 'src/entities/dish.entity';
import { HttpResponseDto, } from 'src/dtos/http-response.dto';
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { OrderedDishesDto } from 'src/dtos/order/ordered_dishes.dto';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { MenuCategoryService } from '../menu_category/menu_category.service';
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';
import Decimal from 'decimal.js';

@Injectable()
export class DishService {

  constructor(private readonly dishRepository: DishRepository, private menu_category_service: MenuCategoryService) { }

  async getDishById(id: string): Promise<Dish> {
    const found_dish: Dish | undefined = await this.dishRepository.getDishById(id);

    if (found_dish === undefined) {
      throw { error: `Failed to find dish with the provided id`, exception: NotFoundException };
    }

    return found_dish;
  }

  @TryCatchWrapper(HttpMessagesEnum.DISH_CREATION_FAILED, BadRequestException)
  async createDish(dishToCreate: CreateDishDto): Promise<Omit<Dish, "category">> {

    const found_category: Menu_Category = await this.menu_category_service.getCategoryAndDishes(dishToCreate.category);
    const existing_dish = found_category.dishes.some((dish: Dish) => dish.name === dishToCreate.name);

    if (existing_dish) {
      throw { error: "There is already a dish with that name", exception: ConflictException };
    }

    const { price } = dishToCreate;

    const { category, ...no_relations_dish } = await this.dishRepository.createDish(dishToCreate, new Decimal(price), found_category);
    return no_relations_dish;
  }

  @TryCatchWrapper(HttpMessagesEnum.DISH_UPDATE_FAILED, BadRequestException)
  async updateDish(id: string, modified_dish: UpdateDishDto): Promise<Dish> {

    const existingDish: Dish = await this.getDishById(id);
    let found_category: Menu_Category;
    let found_price: Decimal;

    if (modified_dish.category) {
      found_category = await this.menu_category_service.getCategoryAndDishes(modified_dish.category);
    }
    if (modified_dish.price) {
      found_price = new Decimal(modified_dish.price);
    }

    return this.dishRepository.updateDish(existingDish, {
      ...modified_dish,
      price: modified_dish.price ? found_price : null,
      category: modified_dish.category ? found_category : null
    });

  }

  @TryCatchWrapper(HttpMessagesEnum.DISH_DELETE_FAIL, InternalServerErrorException)
  async deleteDish(id: string): Promise<HttpResponseDto> {

    const existing_dish: Dish = await this.getDishById(id);

    await this.dishRepository.deleteDish(existing_dish);
    return { message: HttpMessagesEnum.DISH_DELETE_SUCCESS };
  }

  async getManyDishesById(dishes: OrderedDishesDto[]): Promise<Dish[]> {
    const dishes_ids: string[] = dishes.map((dish) => dish.id);
    const found_dishes: Dish[] = await this.dishRepository.getManyDishesById(dishes_ids);

    const notFoundedDishes: string[] = dishes_ids.filter((dish) =>
      !found_dishes.map((foundDishes) => foundDishes.id).includes(dish));

    if (notFoundedDishes.length > 0) {
      throw { error: "One or more dishes can't be found", exception: NotFoundException };
    }

    return found_dishes;
  }
}