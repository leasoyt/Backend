import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "src/dtos/auth/register.dto";
import { UserService } from "../user/user.service";
import { SanitizedUserDto } from "src/dtos/user/sanitized-user.dto";
import { User } from "src/entities/user.entity";
import { isNotEmpty } from "class-validator";
import { LoginDto } from "src/dtos/auth/login.dto";
import { LoginResponseDto } from "src/dtos/auth/login-response.dto";
import { UpdatePasswordDto } from "src/dtos/user/update-password.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { HandleError } from "src/decorators/generic-error.decorator";

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }


  @HandleError(HttpMessagesEnum.REGISTRATION_FAIL, BadRequestException)
  async userRegistration(userObject: RegisterDto): Promise<SanitizedUserDto> {
    const { email, password, confirmPassword, ...rest_user } = userObject;

    if (password !== confirmPassword) {
      throw { error: "Passwords don't match!" };
    }

    const is_existent: User | undefined = await this.userService.getUserByMail(email);
    if (isNotEmpty(is_existent)) {
      throw { error: "Email already on use!" };
    }

    const hashed_password = await bcrypt.hash(password, 10);

    if (!hashed_password) {
      throw { error: "Failed to hash password" };
    }

    const user: SanitizedUserDto = await this.userService.createUser({ ...rest_user, email, password: hashed_password });
    return user;
  }


  @HandleError(HttpMessagesEnum.PASSWORD_UPDATE_FAILED,)
  async updateAndHashPassword(id: string, passwordModification: UpdatePasswordDto): Promise<SanitizedUserDto> {
    const { password, confirmPassword, old_password } = passwordModification;

    if (password !== confirmPassword) {
      throw { error: "Passwords Don't match!" };
    }

    return await this.userService.updatePassword(id, old_password, password);
  }


  @HandleError(HttpMessagesEnum.LOGIN_FAIL, BadRequestException)
  async userLogin(credentials: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = credentials;

    const user: User | undefined = await this.userService.getUserByMail(email);

    if (isNotEmpty(user)) {

      const is_valid_password = await bcrypt.compare(password, user.password);

      if (is_valid_password) {
        const token = this.jwtService.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        return {
          message: HttpMessagesEnum.LOGIN_SUCCESS,
          token,
          user: {
            name: user.name,
            email: user.email,
            country: user.country,
            profile_image: user.profile_image,
          },
        };
      }
    }
    throw { error: 'Invalid credentials' };
  }
}
