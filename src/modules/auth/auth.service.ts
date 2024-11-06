/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from 'src/dtos/auth/register.dto';
import { UserService } from '../user/user.service';
import { SanitizedUserDto } from 'src/dtos/user/sanitized-user.dto';
import { User } from 'src/entities/user.entity';
import { isNotEmpty } from 'class-validator';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { LoginResponseDto } from 'src/dtos/auth/login-response.dto';
import { UpdatePasswordDto } from 'src/dtos/user/update-password.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';
import { MailService } from '../mail/mail.service';
import { Restaurant } from 'src/entities/restaurant.entity';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly mailService: MailService, private readonly restaurantService: RestaurantService) { }


  @TryCatchWrapper(HttpMessagesEnum.REGISTRATION_FAIL, BadRequestException)
  async userRegistration(userObject: RegisterDto): Promise<SanitizedUserDto> {
    const { email, password, confirmPassword, ...rest_user } = userObject;

    if (password !== confirmPassword) {
      throw { error: "Passwords don't match!" };
    }

    const is_existent: User | undefined =
      await this.userService.getUserByMail(email);
      console.log('is existent',is_existent);
      
    if (isNotEmpty(is_existent)) {
      throw { error: 'Este correo ya esta registrado!', exception: ConflictException };
    }

    const hashed_password = await bcrypt.hash(password, 10);

    if (!hashed_password) {
      throw {
        error: 'Failed to hash password',
        exception: InternalServerErrorException,
      };
    }

    const user: SanitizedUserDto = await this.userService.createUser({
      ...rest_user,
      email,
      password: hashed_password,
    });
    try {
      await this.mailService.sendWelcomeEmail(user);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // throw {
      //   error: 'No se pudo enviar el email de bienvenida.',
      //   exception: InternalServerErrorException,
      // };
    }
    return user;
  }


  @TryCatchWrapper(HttpMessagesEnum.REGISTRATION_FAIL, BadRequestException)
  async waiterRegistration(userObject: RegisterDto, id: string): Promise<SanitizedUserDto> {
    const { email, password, confirmPassword, ...rest_user } = userObject;
    let restaurant: Restaurant;

    try {
      restaurant = await this.restaurantService.getRestaurantById(id);
    } catch (err) {
      throw { error: HttpMessagesEnum.REGISTRATION_FAIL, exception: BadRequestException }
    }

    if (password !== confirmPassword) {
      throw { error: "Passwords don't match!" };
    }

    const is_existent: User | undefined = await this.userService.getUserByMail(email);

    if (isNotEmpty(is_existent)) {
      throw { error: 'Este correo ya esta registrado!', exception: ConflictException };
    }

    const hashed_password = await bcrypt.hash(password, 10);

    if (!hashed_password) {
      throw {
        error: 'Failed to hash password',
        exception: InternalServerErrorException,
      };
    }

    const user: SanitizedUserDto = await this.userService.createWaiter({
      ...rest_user,
      email,
      password: hashed_password,
    }, restaurant);

    return user;
  }


  @TryCatchWrapper(HttpMessagesEnum.PASSWORD_UPDATE_FAILED)
  async updateAndHashPassword(id: string, passwordModification: UpdatePasswordDto): Promise<SanitizedUserDto> {
    const { password, confirmPassword, old_password } = passwordModification;

    if (password !== confirmPassword) {
      throw { error: "Passwords Don't match!" };
    }

    return await this.userService.updatePassword(id, old_password, password);
  }


  @TryCatchWrapper(HttpMessagesEnum.LOGIN_FAIL, BadRequestException)
  async userLogin(credentials: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = credentials;

    const user: User | undefined = await this.userService.getUserByMail(email);
    console.log('user',user);
    

    if (user.was_deleted) {
      throw { error: HttpMessagesEnum.USER_DELETED, exception: BadRequestException};
    }

    if (isNotEmpty(user)) {
      const is_valid_password = await bcrypt.compare(password, user.password);




      if (is_valid_password) {
        const token = this.jwtService.sign({
          id: user.id,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin
        });

        // console.log('isadmin', user.isAdmin);

        console.log("AAAAAAAAAAAAAAAaaa");
        console.log(user.was_deleted);
        return {
          message: HttpMessagesEnum.LOGIN_SUCCESS,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            country: user.country,
            profile_image: user.profile_image,
            role: user.role,
            was_deleted: user.was_deleted,
          },
        };
      }
    }
    throw { error: 'Credenciales invalidas!' };
  }
}
