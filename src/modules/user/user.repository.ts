/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { RegisterDto } from 'src/dtos/auth/register.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { Restaurant } from 'src/entities/restaurant.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/enums/roles.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserRepository {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async getUsers(page: number, limit: number): Promise<Omit<User, 'password'>[]> {
    const [users, total] = await this.userRepository.findAndCount({ skip: (page - 1) * limit, take: limit });

    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  async getUserById(id: string): Promise<User | undefined> {
    const found_user: User | null = await this.userRepository.findOne({
      where: { id: id },
    });
    return found_user === null ? undefined : found_user;
  }

  async updateUser(actual_user: User, modified_user: UpdateUserDto): Promise<User> {
    this.userRepository.merge(actual_user, modified_user);
    await this.userRepository.save(actual_user);

    return actual_user;
  }

  async addSubscriptionToUser(actual_user: User, idSubscription: string, status: string): Promise<void> {
    actual_user.subscription = idSubscription;
    switch (status) {
      case 'pending':
        actual_user.subscriptionStatus = SubscriptionStatus.PENDING;
        break;
      case 'authorized':
        actual_user.subscriptionStatus = SubscriptionStatus.AUTHORIZED;
        break;
      case 'paused':
        actual_user.subscriptionStatus = SubscriptionStatus.PAUSED;
        break;
      case 'cancelled':
        actual_user.subscriptionStatus = SubscriptionStatus.CANCELLED;
        break;
      default:
        throw new BadRequestException
    }
    await this.userRepository.save(actual_user);
  }

  async createWaiter(userObject: Omit<RegisterDto, "confirmPassword">, restaurant: Restaurant): Promise<User> {
    const created_user: User = this.userRepository.create(userObject);
    created_user.waiterRestaurant = restaurant;
    return await this.userRepository.save(created_user);
  }

  async updateSubscriptionStatus(status: string, idSubscription: string): Promise<void> {
    const found_user: User | undefined = await this.userRepository.findOne({
      where: {
        subscription: idSubscription
      }
    })
    if (!found_user) {
      throw new Error('User not found');
    }
    switch (status) {
      case 'pending':
        found_user.subscriptionStatus = SubscriptionStatus.PENDING;
        break;
      case 'authorized':
        found_user.subscriptionStatus = SubscriptionStatus.AUTHORIZED;
        break;
      case 'paused':
        found_user.subscriptionStatus = SubscriptionStatus.PAUSED;
        break;
      case 'cancelled':
        found_user.subscriptionStatus = SubscriptionStatus.CANCELLED;
        break;
      default:
        throw new BadRequestException
    }
    await this.userRepository.save(found_user);
  }

  async getUserByMail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async getRestaurantWaiters(restaurant: Restaurant): Promise<User[] | undefined> {
    const found_waiters: User[] | null | undefined = await this.userRepository.find({ where: { waiterRestaurant: restaurant } });
    return found_waiters === null || found_waiters === null ? undefined : found_waiters;
  }

  async getUserBySuscriptions(idsSubscription: string[]): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        subscription: In(idsSubscription),
      },
    });
  }

  async createUser(userObject: Omit<RegisterDto, 'confirmPassword'>): Promise<User> {
    const created_user: User = this.userRepository.create(userObject);
    return await this.userRepository.save(created_user);
  }

  async deleteUser(to_delete: User): Promise<User | undefined> {
    const deletion_result: User = await this.userRepository.remove(to_delete);

    if (isEmpty(deletion_result)) {
      return undefined;
    }

    return deletion_result;
  }

  async rankUpTo(userInstance: User, role: UserRole): Promise<User | undefined> {
    userInstance.role = role;
    await this.userRepository.save(userInstance);
    return await this.getUserById(userInstance.id);
  }


}
