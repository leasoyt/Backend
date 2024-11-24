/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty, isUUID } from 'class-validator';
import { RegisterRestaurantDto } from 'src/dtos/restaurant/register-restaurant.dto';
import { RestaurantQueryManyDto } from 'src/dtos/restaurant/restaurant-query-many.dto';
import { UpdateRestaurant } from 'src/dtos/restaurant/updateRestaurant.dto';
import { Menu } from 'src/entities/menu.entity';
import { Restaurant } from 'src/entities/restaurant.entity';
import { User } from 'src/entities/user.entity';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';
import { CustomHttpException } from 'src/helpers/custom-error-class';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    // private menuRepository: Repository<Menu>
  ) { }

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
        relations: ['menu', 'menu.categories', 'menu.categories.dishes'],
      });

    return found_restaurant === null ? undefined : found_restaurant;
  }

  async createRestaurant(future_manager: User, restaurantObject: RegisterRestaurantDto, created_menu: Menu,): Promise<Restaurant> {
    const is_existent: Restaurant | null = await this.restaurantRepository.findOne({ where: { manager: future_manager } });

    if (is_existent !== null) {
      throw new CustomHttpException(HttpMessagesEnum.RESTAURANT_CONFLICT, BadRequestException).throw;
    }

    const saved_restaurant: Restaurant = await this.restaurantRepository.save(this.restaurantRepository.create({
      ...restaurantObject,
      manager: future_manager,
      rating: 0,
      menu: created_menu
    }),
    );
    return saved_restaurant === null ? undefined : saved_restaurant;

  }

  async deleteRestaurant(restaurantInstance: Restaurant): Promise<boolean> {
    const removed: DeleteResult = await this.restaurantRepository.createQueryBuilder("user")
      .delete()
      .where("restaurant.id = :id", { id: restaurantInstance.id })
      .execute();

    return removed.affected !== 0 ? true : false;
  }

  async getRestaurantByManager(found_manager: User): Promise<Restaurant> {
    const found_restaurant = await this.restaurantRepository.findOne({ where: { manager: found_manager } });

    return found_restaurant === null ? undefined : found_restaurant;
  }

  async getRestaurantsQuery(page: number, limit: number, rating?: number, search?: string): Promise<RestaurantQueryManyDto> {

    const queryBuilder =
      this.restaurantRepository.createQueryBuilder('restaurant');

    const is_rating: boolean = rating >= 0 || rating <= 5;
    const is_search: boolean = isNotEmpty(search);

    const searchQuery = `(restaurant.name ILIKE :search OR restaurant.description ILIKE :search OR restaurant.address ILIKE :search)`;
    const ratingQuery = 'restaurant.rating = :rating';
    const no_rating_query = 'restaurant.rating IS NOT NULL OR restaurant.rating IS NULL';

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

  async getRestaurantByName(name: string): Promise<Restaurant | undefined> {
    const found_restaurant: Restaurant | null =
      await this.restaurantRepository.findOne({ where: { name } });
    return found_restaurant;
  }

  async getAllRestaurantNames(): Promise<string[]> {
    const restaurants = await this.restaurantRepository.find({
      select: ['name'],
    });
    const restaurantNames = restaurants.map(restaurant => restaurant.name);
    return restaurantNames;
  }

  // async getRestaurantOrders(restaurantInstance: Restaurant): Promise<Order[]> {

  // }

  async banOrUnbanRestaurant(found_restaurant: Restaurant, flag: boolean): Promise<[Restaurant, "deleted" | "restored"]> {
    found_restaurant.was_deleted = !flag;

    const saved_restaurant: Restaurant = await this.restaurantRepository.save(found_restaurant);

    const get_restaurant: Restaurant = await this.restaurantRepository.findOne({
      where: { id: saved_restaurant.id },
      relations: ['manager'],
    });


    return [get_restaurant, saved_restaurant.was_deleted ? "deleted" : "restored"];
  }
}