import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterRestaurantDto } from "src/dtos/restaurant/register-restaurant.dto";
import { Restaurant } from "src/entities/restaurant.entity";
import { User } from "src/entities/user.entity";
import { Like, Repository } from "typeorm";

@Injectable()
export class RestaurantRepository {
    
    constructor(@InjectRepository(Restaurant) private restaurantRepository: Repository<Restaurant>) { }
    
    async getRestaurantById(id: string): Promise<Restaurant | undefined> {
        const found_restaurant: Restaurant | null = await this.restaurantRepository.findOne({ where: { id: id } })
        return found_restaurant === null ? undefined : found_restaurant;
    }
    
    async createRestaurant(future_manager: User, restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
        const saved_restaurant: Restaurant | null = await this.restaurantRepository.save(this.restaurantRepository.create({ ...restaurantObject, manager: future_manager }));
        return saved_restaurant === null ? undefined : saved_restaurant;
    }
    
   async  getRestaurantsQuery(page:number,limit:number,rating?:number,search?:string) {
        const where: any = {};
         // Si se proporciona búsqueda, añadir filtros de búsqueda por nombre, dirección o descripción
    if (search) {
        where.name = Like(`%${search}%`);
        where.address = Like(`%${search}%`);
        where.description = Like(`%${search}%`);
      }
  
      // Si se proporciona rating, añadir filtro por calificación
      if (rating) {
        where.rating = { $gte: rating }; // Esto asume que tienes un campo "rating" en la entidad
      }

      const [restaurants, total] = await this.restaurantRepository.findAndCount({
        where: [
          { name: Like(`%${search}%`) },
          { address: Like(`%${search}%`) },
          { description: Like(`%${search}%`) }
        ],
        skip: (page - 1) * limit,
        take: limit,
        order: { name: 'ASC' },
      });

      return {
        totalItems: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        restaurants,
      };

    }
}