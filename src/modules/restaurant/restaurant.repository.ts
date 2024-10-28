/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty } from 'class-validator';
import { RegisterRestaurantDto } from 'src/dtos/restaurant/register-restaurant.dto';
import { RestaurantQueryManyDto } from 'src/dtos/restaurant/restaurant-query-many.dto';
import { UpdateRestaurant } from 'src/dtos/restaurant/updateRestaurant.dto';
import { Restaurant } from 'src/entities/restaurant.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async updateRestaurant(
    restaurantInstance: Restaurant,
    updateData: UpdateRestaurant,
  ): Promise<Restaurant> {
    this.restaurantRepository.merge(restaurantInstance, updateData);
    return await this.restaurantRepository.save(restaurantInstance);
  }

  async getRestaurantById(id: string): Promise<Restaurant | undefined> {
    const found_restaurant: Restaurant | null =
      await this.restaurantRepository.findOne({
        where: { id: id },
        relations: ['menu', 'menu.categories'],
      });
    console.log('Restaurant Data: ', found_restaurant);
    return found_restaurant === null ? undefined : found_restaurant;
  }

  async createRestaurant(
    future_manager: User,
    restaurantObject: RegisterRestaurantDto,
  ): Promise<Restaurant> {
    const { tables, ...rest } = restaurantObject;

    const saved_restaurant: Restaurant = await this.restaurantRepository.save(
      this.restaurantRepository.create({
        ...rest,
        manager: future_manager,
        rating: 0,
      }),
    );
    return saved_restaurant;
  }

  async deleteRestaurant(restaurantInstance: Restaurant): Promise<boolean> {
    const removed: Restaurant =
      await this.restaurantRepository.remove(restaurantInstance);
    return removed instanceof Restaurant ? true : false;
  }

  async getRestaurantsQuery(
    page: number,
    limit: number,
    rating?: number,
    search?: string,
  ): Promise<RestaurantQueryManyDto> {
    const queryBuilder =
      this.restaurantRepository.createQueryBuilder('restaurant');

    const is_rating: boolean = rating >= 0 || rating <= 5;
    const is_search: boolean = isNotEmpty(search);

    const searchQuery = `(restaurant.name ILIKE :search OR restaurant.description ILIKE :search OR restaurant.address ILIKE :search)`;
    const ratingQuery = 'restaurant.rating = :rating';
    const no_rating_query =
      'restaurant.rating IS NOT NULL OR restaurant.rating IS NULL';

    if (is_search && is_rating) {
      queryBuilder
        .andWhere(searchQuery, { search: `%${search}%` })
        .andWhere(ratingQuery, { rating });
    } else if (is_search) {
      queryBuilder.where(searchQuery, { search }).andWhere(no_rating_query);
    } else {
      if (is_rating) {
        queryBuilder.andWhere(ratingQuery, { rating });
      } else {
        queryBuilder.andWhere(no_rating_query);
      }
    }

    const [restaurants, items] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('restaurant.name', 'ASC')
      .getManyAndCount();
    return {
      items: items,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(items / limit),
      restaurants,
    };
  }

  // async getRestaurantOrders(restaurantInstance: Restaurant): Promise<Order[]> {

  // }
}
