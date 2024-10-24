/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { RegisterDto } from 'src/dtos/auth/register.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/enums/roles.enum';
import { Repository } from 'typeorm';

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

  async getUserByMail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
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
