import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "src/dtos/auth/register.dto";
import { UserService } from "../user/user.service";
import { SanitizedUserDto } from "src/dtos/user/sanitizedUser.dto";
import { User } from "src/entities/user.entity";
import { isNotEmpty } from "class-validator";
import { LoginDto } from "src/dtos/auth/login.dto";
import { LoginResponseDto } from "src/dtos/auth/loginResponse.dto";

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService) { }

    async userRegistration(userObject: RegisterDto): Promise<SanitizedUserDto> {
        const { email, password, confirmPassword, ...rest_user } = userObject;

        if (password !== confirmPassword) {
            throw new BadRequestException("Passwords don't match!");
        }

        const is_existent: User | undefined = await this.userService.getUserByMail(email);

        if (isNotEmpty(is_existent)) {
            throw new BadRequestException("Email already on use!");
        }

        const user: SanitizedUserDto = await this.userService.createUser({ ...rest_user, email, password });
        return user;

    }

    async userLogin(credentials: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = credentials;

        const user: User | undefined = await this.userService.getUserByMail(email);

        if (isNotEmpty(user) && password === user.password) {
            return {
                message: "Logged in successfully",
                token: "no-token-yet",
                user: {
                    name: user.name,
                    email: user.email,
                    country: user.country,
                    profile_image: user.profile_image
                }
            }
        }
        throw new BadRequestException("Invalid credentials!");
    }

}