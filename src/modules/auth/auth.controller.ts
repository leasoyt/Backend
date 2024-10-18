import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SanitizedUserDto } from "src/dtos/user/sanitizedUser.dto";
import { RegisterDto } from "src/dtos/auth/register.dto";
import { LoginDto } from "src/dtos/auth/login.dto";
import { LoginResponseDto } from "src/dtos/auth/loginResponse.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async userRegistration(@Body() userObject: RegisterDto): Promise<SanitizedUserDto> {
        const created_user = await this.authService.userRegistration(userObject);
        return created_user;
    }

    @Post("login")
    async userLogin(@Body() userCredentials: LoginDto): Promise<LoginResponseDto> {
        return await this.authService.userLogin(userCredentials);
    }

}