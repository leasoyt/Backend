/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNumber } from 'class-validator';
import { RegisterRestaurantDto } from 'src/dtos/restaurant/register-restaurant.dto';
import { UpdateRestaurant } from 'src/dtos/restaurant/updateRestaurant.dto';
import { Restaurant } from 'src/entities/restaurant.entity';
import { User } from 'src/entities/user.entity';
import { Like, Repository, MoreThanOrEqual, Equal } from 'typeorm';

@Injectable()
export class RestaurantRepository {

  constructor(@InjectRepository(Restaurant) private restaurantRepository: Repository<Restaurant>) { }

  async updateRestaurant(restaurantInstance: Restaurant, updateData: Omit<UpdateRestaurant, "tables">): Promise<Restaurant> {
    this.restaurantRepository.merge(restaurantInstance, updateData);
    return await this.restaurantRepository.save(restaurantInstance);
  }

  async getRestaurantById(id: string): Promise<Restaurant | undefined> {
    const found_restaurant: Restaurant | null = await this.restaurantRepository.findOne({ where: { id: id } });
    return found_restaurant === null ? undefined : found_restaurant;
  }

  async createRestaurant(future_manager: User, restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
    const { tables, ...rest } = restaurantObject;

    const saved_restaurant: Restaurant = await this.restaurantRepository.save(this.restaurantRepository.create({ ...rest, manager: future_manager }));
    return saved_restaurant;
  }

  async deleteRestaurant(restaurantInstance: Restaurant): Promise<boolean> {
    const removed: Restaurant = await this.restaurantRepository.remove(restaurantInstance);
    return removed instanceof Restaurant ? true : false;
  }

  async getRestaurantsQuery(page: number, limit: number, rating?: number, search?: string) {
    const where = { rating: null, name: null, adress: null, description: null };

    if (search) {
      console.log(search);
      // where.push({ name: Like(`%${search}%`) }, { address: Like(`%${search}%`) }, { description: Like(`%${search}%`) },);
      where.name = Like(`%${search}%`);
      where.description = Like(`%${search}%`);
      where.adress = Like(`%${search}%`);
    }

    if (rating >= 0 || rating <= 5) {
      where.rating = rating;
    }

    const [restaurants, total] = await this.restaurantRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return { totalItems: total, page, limit, totalPages: Math.ceil(total / limit), restaurants };
  }
}
