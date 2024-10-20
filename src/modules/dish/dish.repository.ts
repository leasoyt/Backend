import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from 'src/dtos/dish/create-dish.dto';
import { UpdateDishDto } from 'src/dtos/dish/update-dish.dto';
import { Dish } from 'src/entities/dish.entity';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DishRepository {
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>,
    @InjectRepository(Menu_Category)
    private readonly menuCategoryRepository: Repository<Menu_Category>,
  ) {}

  async getDishById(id: string): Promise<undefined | Dish> {
    const foundDish: null | Dish = await this.dishRepository.findOneBy({ id });
    return foundDish === null ? undefined : foundDish;
  }

  async createDish(dishToCreate: CreateDishDto, categoryId: string) {
    const menu_category = await this.menuCategoryRepository.findOne({
      where: { id: categoryId },
      relations: ['dishes'],
    });
    if (!menu_category) {
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

    newDish.category = menu_category;

    const savedDish = await this.dishRepository.save(newDish);

    menu_category.dishes.push(savedDish);
    await this.menuCategoryRepository.save(menu_category);

    return savedDish;
  }

  async updateDish(
    existingDish: Dish,
    dish_to_modify: UpdateDishDto,
  ): Promise<Dish> {
    const dishToUpdate: Dish = this.dishRepository.merge(
      existingDish,
      dish_to_modify,
    );
    return this.dishRepository.save(dishToUpdate);
  }

  async deleteDish(dishToRemove: Dish): Promise<Dish> {
    return await this.dishRepository.remove(dishToRemove);
  }

  async getDishesByIds(ids: string[]): Promise<Dish[]>{
    const foundedDishes: Dish[] = await this.dishRepository.findBy({ id: In(ids) })
    return foundedDishes;
  }
}
