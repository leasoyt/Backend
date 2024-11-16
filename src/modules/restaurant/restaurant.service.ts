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
import { isEmpty, isUUID } from 'class-validator';
import { NotificationsService } from '../notifications/notifications.service';
import { UuidBodyDto } from 'src/dtos/generic-uuid-body.dto';
import { SanitizedUserDto } from '../../dtos/user/sanitized-user.dto';
import { CustomHttpException } from 'src/helpers/custom-error-class';

@Injectable()
export class RestaurantService {

  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => MenuService)) private readonly menuService: MenuService,
    private readonly notificationService: NotificationsService
  ) { }


  @TryCatchWrapper(HttpMessagesEnum.NO_WAITERS_IN_RESTAURANT, NotFoundException)
  async getRestaurantWaiters(id: string): Promise<SanitizedUserDto[]> {
    const restaurant: Restaurant = await this.getRestaurantById(id);

    const found_waiters: User[] = await this.userService.getRestaurantWaiters(restaurant);

    const sanitized_waiters: SanitizedUserDto[] = found_waiters.map((user) => {
      const { password, ...rest } = user;
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


  @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_DELETION_FAILED, InternalServerErrorException)
  async deleteRestaurant(id: string): Promise<HttpResponseDto> {
    const found_restaurant: Restaurant = await this.getRestaurantById(id);
    const was_deleted: boolean = await this.restaurantRepository.deleteRestaurant(found_restaurant);

    if (!was_deleted) {
      throw { error: "Something went wrong" };
    }

    return { message: HttpMessagesEnum.RESTAURANT_DELETION_SUCCESS };
  }


  @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_CREATION_FAILED, BadRequestException)
  async createRestaurant(restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
    let id = "";

    try {
      const future_manager: User = await this.userService.rankUpTo(restaurantObject.future_manager, UserRole.MANAGER);

      const created_menu: Menu = await this.menuService.createMenu();
      const created_restaurant: Restaurant | undefined = await this.restaurantRepository.createRestaurant(future_manager, restaurantObject, created_menu);

      if (created_restaurant === undefined) {
        // throw { message: HttpMessagesEnum.RESTAURANT_CREATION_FAILED, exception: InternalServerErrorException }
        throw new CustomHttpException(null, InternalServerErrorException).throw;
      }

      await this.menuService.updateMenu(created_menu, created_restaurant);
      id = created_restaurant.id;

      return await this.getRestaurantById(created_restaurant.id);

    } catch (err) {

      await this.userService.rankUpTo(restaurantObject.future_manager, UserRole.CONSUMER);

      if (isUUID(id)) {
        await this.deleteRestaurant(id);
      }

      throw new CustomHttpException(null, InternalServerErrorException, err).throw;
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


  @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_DELETION_FAILED, BadRequestException)
  async banOrUnbanRestaurant(id: string): Promise<HttpResponseDto> {

    const found_restaurant: Restaurant | undefined = await this.restaurantRepository.getRestaurantById(id);

    if (found_restaurant === undefined) {
      throw new CustomHttpException(HttpMessagesEnum.RESTAURANT_NOT_FOUND, NotFoundException).throw;
    }

    const [updated_restaurant, status]: [Restaurant, string] = await this.restaurantRepository.banOrUnbanRestaurant(found_restaurant);

    const manager_id: string = updated_restaurant.manager.id;

    if (updated_restaurant.was_deleted && status === "deleted") {

      await this.userService.rankUpTo(manager_id, UserRole.CONSUMER);

      return { message: HttpMessagesEnum.RESTAURANT_DELETION_SUCCESS };

    } else if (!updated_restaurant.was_deleted && status === "restored") {

      await this.userService.rankUpTo(manager_id, UserRole.MANAGER);

      return { message: HttpMessagesEnum.RESTAURANT_RESTORED };

    }

    throw new CustomHttpException(HttpMessagesEnum.UNKNOWN_ERROR, BadRequestException).throw;

  }
}