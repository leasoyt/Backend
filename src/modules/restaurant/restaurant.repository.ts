import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRestaurantDto } from 'src/dtos/restaurant/register-restaurant.dto';
import { UpdateRestaurant } from 'src/dtos/restaurant/updateRestaurant.dto';
import { Restaurant } from 'src/entities/restaurant.entity';
import { User } from 'src/entities/user.entity';
import { Like, Repository, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async updateRestaurant(id: string, updateData: UpdateRestaurant) {
    const restaurant = await this.restaurantRepository.findOneBy({ id });
    if (!restaurant) {
      throw new HttpException('restaurant not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.restaurantRepository.update(id, updateData);
      const updatedRestaurant = await this.restaurantRepository.findOneBy({
        id,
      });
      return updatedRestaurant;
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRestaurantById(id: string): Promise<Restaurant | undefined> {
    const found_restaurant: Restaurant | null =
      await this.restaurantRepository.findOne({ where: { id: id } });
    return found_restaurant === null ? undefined : found_restaurant;
  }

  async createRestaurant(
    future_manager: User,
    restaurantObject: RegisterRestaurantDto,
  ): Promise<Restaurant> {
    const saved_restaurant: Restaurant | null =
      await this.restaurantRepository.save(
        this.restaurantRepository.create({
          ...restaurantObject,
          manager: future_manager,
        }),
      );
    return saved_restaurant === null ? undefined : saved_restaurant;
  }

  async deleteRestaurant(id: string): Promise<void> {
    const restaurant = this.restaurantRepository.findOneBy({ id });
    if (!restaurant) {
      throw new Error('Product not found');
    }
    await this.restaurantRepository.delete(id);
  }

  async getRestaurantsQuery(
    page: number,
    limit: number,
    rating?: number,
    search?: string,
  ) {
    // Inicializamos where como un arreglo
    const where: any[] = [];

    // Si se proporciona búsqueda, añadir filtros de búsqueda por nombre, dirección o descripción
    if (search) {
      where.push(
        { name: Like(`%${search}%`) },
        { address: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      );
    }

    // Si se proporciona rating, añadir filtro por calificación
    if (rating) {
      where.push({ rating: MoreThanOrEqual(rating) }); // Asegúrate de usar el operador correcto
    }

    const [restaurants, total] = await this.restaurantRepository.findAndCount({
      where,
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
