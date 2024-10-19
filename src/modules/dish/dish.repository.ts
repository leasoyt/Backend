import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDishDto } from "src/dtos/dish/create-dish.dto";
import { UpdateDish } from "src/dtos/dish/update-dish.dto";
import { Dish } from "src/entities/dish.entity";
import { Menu } from "src/entities/menu.entity";
import { Repository } from "typeorm";

@Injectable()
export class DishRepository {
    constructor(@InjectRepository(Dish) private dishRepository: Repository<Dish>) { }

    async getDishByName(name: string): Promise<null | Dish> {
        const foundDish: null | Dish = await this.dishRepository.findOneBy({ name });
        return foundDish;
    }

    async getDishById(id: string): Promise<null | Dish> {
        const foundDish: null | Dish = await this.dishRepository.findOneBy({ id })
        return foundDish;
    }

    async createDish(dishToCreate: CreateDishDto, menu: Menu): Promise<Dish> {
        const createdDish: Dish = this.dishRepository.create({ ...dishToCreate, menu })
        return this.dishRepository.save(createdDish)
    }

    async updateDish(existingDish: Dish, dish_to_modify: UpdateDish): Promise<Dish> {
        const dishToUpdate: Dish = this.dishRepository.merge(existingDish, dish_to_modify)
        return this.dishRepository.save(dishToUpdate)
    }

    async deleteDish(dishToRemove: Dish) {
        return this.dishRepository.remove(dishToRemove)
    }

}