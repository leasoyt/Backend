/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { Restaurant } from 'src/entities/restaurant.entity';
import { RegisterRestaurantDto } from 'src/dtos/restaurant/register-restaurant.dto';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { UpdateRestaurant } from 'src/dtos/restaurant/updateRestaurant.dto';
import { MenuService } from '../menu/menu.service';
import { HttpResponseDto } from 'src/dtos/http-response.dto';
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';
import { RestaurantQueryManyDto } from 'src/dtos/restaurant/restaurant-query-many.dto';
import { Menu } from 'src/entities/menu.entity';
import { isUUID } from 'class-validator';
import { NotificationsService } from '../notifications/notifications.service';
import { UuidBodyDto } from 'src/dtos/generic-uuid-body.dto';
import { SanitizedUserDto } from '../../dtos/user/sanitized-user.dto';

@Injectable()
export class RestaurantService {

  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => MenuService)) private readonly menuService: MenuService,
    private readonly notificationService: NotificationsService
  ) { }

  @TryCatchWrapper(HttpMessagesEnum.USER_NOT_FOUND, NotFoundException)
  async getRestaurantWaiters(id: string): Promise<SanitizedUserDto[]> {
    let restaurant: Restaurant;
    let found_waiters: User[]
    try {
      restaurant = await this.getRestaurantById(id);
    } catch (err) {
      throw err || { error: HttpMessagesEnum.RESTAURANT_NOT_FOUND, exception: NotFoundException }
    }
    try {
      found_waiters = await this.userService.getRestaurantWaiters(restaurant);
    } catch (err) {
      throw err || { error: HttpMessagesEnum.NO_WAITERS_IN_RESTAURANT, exception: NotFoundException }
    }

    const sanitized_waiters: SanitizedUserDto[] = found_waiters.map((user) => {
      const { password, isAdmin, ...rest } = user;
      return rest;
    });

    return sanitized_waiters;
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    const found_restaurant: Restaurant | undefined = await this.restaurantRepository.getRestaurantById(id);

    if (found_restaurant === undefined) {
      throw { error: HttpMessagesEnum.RESTAURANT_NOT_FOUND, NotFoundException };
    }

    return found_restaurant;
  }

  @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_NOT_FOUND, InternalServerErrorException)
  async getRestaurantByManager(id: string): Promise<UuidBodyDto> {
    const found_manager: User = await this.userService.getRawUserById(id);
    const found_restaurant: Restaurant | undefined = await this.restaurantRepository.getRestaurantByManager(found_manager);

    if (found_restaurant === undefined) {
      throw { error: HttpMessagesEnum.RESTAURANT_NOT_FOUND, NotFoundException };

    }

    return { id: found_restaurant.id };

  }


  @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_NOT_FOUND, InternalServerErrorException)
  async getRestaurantByName(name: string): Promise<Restaurant | null> {
    return await this.restaurantRepository.getRestaurantByName(name)
  }

  // @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_DELETION_FAILED, InternalServerErrorException)
  @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_DELETION_FAILED, InternalServerErrorException)
  async deleteRestaurant(id: string): Promise<HttpResponseDto> {
    const found_restaurant: Restaurant = await this.getRestaurantById(id);
    const was_deleted: boolean = await this.restaurantRepository.deleteRestaurant(found_restaurant);

    if (!was_deleted) {
      throw { error: "Something went wrong" };
    }

    return { message: HttpMessagesEnum.RESTAURANT_DELETION_SUCCESS };
  }

  @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_CREATION_FAILED, InternalServerErrorException)
  async createRestaurant(restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
    let id = "";
    try {
      const future_manager: User = await this.userService.rankUpTo(restaurantObject.future_manager, UserRole.MANAGER);
      const created_menu: Menu = await this.menuService.createMenu();
      const created_restaurant: Restaurant | undefined = await this.restaurantRepository.createRestaurant(future_manager, restaurantObject, created_menu);

      if (created_restaurant === undefined) {
        throw { message: HttpMessagesEnum.RESTAURANT_CREATION_FAILED, exception: InternalServerErrorException }
      }

      await this.menuService.updateMenu(created_menu, created_restaurant);
      id = created_restaurant.id;
      this.notificationService.sendNotification('Se ha registrado un nuevo restaurante a Rest0')
      return await this.getRestaurantById(created_restaurant.id);

    } catch (err) {

      await this.userService.rankUpTo(restaurantObject.future_manager, UserRole.CONSUMER);

      if (isUUID(id)) {
        await this.deleteRestaurant(id);
      }

      throw err;
    }
  }

  async updateRestaurant(id: string, updateData: UpdateRestaurant): Promise<Restaurant> {
    const found_restaurant: Restaurant = await this.getRestaurantById(id);
    return this.restaurantRepository.updateRestaurant(found_restaurant, updateData);
  }

  @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, InternalServerErrorException)
  async getRestaurantsQuery(page: number, limit: number, rating?: number, search?: string): Promise<RestaurantQueryManyDto> {
    if (rating < 0 || rating > 5) {
      throw { error: "Rating must be between 0 - 5", exception: BadRequestException };
    }

    const found_restaurants: RestaurantQueryManyDto = await this.restaurantRepository.getRestaurantsQuery(page, limit, rating, search);

    if (found_restaurants.restaurants.length === 0) {
      throw { error: "The restaurant list is empty", exception: BadRequestException };
    }

    return found_restaurants;
  }

  @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, InternalServerErrorException)
  async getAllRestaurantNames(): Promise<string[]> {
    return await this.restaurantRepository.getAllRestaurantNames()
  }

  // async getRestaurantOrders(restaurantInstance: Restaurant): Promise<Order[]> {
  //   const found_orders: Order[] = await this.restaurantRepository.getRestaurantOrders(restaurantInstance);
  // }
}