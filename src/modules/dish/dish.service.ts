import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateDishDto } from "src/dtos/dish/create-dish.dto";
import { UpdateDish } from "src/dtos/dish/update-dish.dto";
import { DishRepository } from "./dish.repository";
import { Dish } from "src/entities/dish.entity";
import { MenuRepository } from "./PruebaMenuRepository";
import { Menu } from "src/entities/menu.entity";

@Injectable()
export class DishService {
    constructor(private readonly dishRepository: DishRepository,
        private readonly menuRepository: MenuRepository
    ){}
    async getDishByName(name: string): Promise<Dish | null> {
        try {
            const foundDish: Dish | null = await this.dishRepository.getDishByName(name)
            return foundDish
        } catch (error) {
            throw new BadRequestException(`Error al buscar el platillo ${error.message}`)
        }
        
    }
    async getDishById(id: string): Promise<Dish | null>{
        try {
            const foundDish: Dish | null = await this.dishRepository.getDishById(id);
            return foundDish
        } catch (error) {
            throw new BadRequestException(`Error al buscar el platillo ${error.message}`)
        }
    }
    async createDish(dishToCreate: CreateDishDto): Promise <Omit<Dish, 'menu' | 'orderDetails'>> {
        const dishWithRepeatedName: null | Dish = await this.getDishByName(dishToCreate.name);
        if (!dishWithRepeatedName) throw new BadRequestException('El nombre del platillo ya está registrado, por favor intente con otro')
        try {
            const foundedMenu: null | Menu = await this.menuRepository.getMenuById(dishToCreate.menu)
            if (!foundedMenu) throw new BadRequestException('El menu al que se quiere agregar este platillo no existe')
            const createdDish: Dish = await this.dishRepository.createDish(dishToCreate, foundedMenu);
            const {menu, orderDetails, ...dishToReturn} = createdDish;
            return dishToReturn;
        } catch (error) {
            throw new BadRequestException(`Error al crear el platillo ${error.message}`)
        }
        
    }
    async updateDish(id: string, modified_dish: UpdateDish): Promise<Dish> {
        const existingDish: null | Dish = await this.getDishById(id);
        if (!existingDish) throw new BadRequestException('El plato que se desea actualizar no existe')
        try {
            const updatedDish: Dish = await this.dishRepository.updateDish(existingDish, modified_dish)
            return updatedDish
        } catch (error) {
            throw new BadRequestException(`Error al actualizar el platillo ${error.message}`)
        }
    }
    async deleteDish(id: string) {
        const existingDish: null | Dish = await this.getDishById(id)
        if (!existingDish) throw new BadRequestException('El plato que se desea eliminar no existe')
        try {
            const deletedDish = await this.dishRepository.deleteDish(existingDish)
            return deletedDish
        } catch (error) {
            throw new BadRequestException(`Error al eliminar el platillo ${error.message}`)
        }
    }
}