import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SanitizedUserDto } from "src/dtos/user/sanitizedUser.dto";
import { RegisterDto } from "src/dtos/auth/register.dto";
import { LoginDto } from "src/dtos/auth/login.dto";
import { LoginResponseDto } from "src/dtos/auth/loginResponse.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @ApiBody({
        schema: {
            example: {
                name: 'Tom howard',
                email: "TomHoward77@mail.com",
                password: "Password!1",
                confirmPassword: "Password!1",
                country: "Francia"
            }
        }
    })
    @Post("register")
    async userRegistration(@Body() userObject: RegisterDto): Promise<SanitizedUserDto> {
        const created_user = await this.authService.userRegistration(userObject);
        return created_user;
    }

    @ApiBody({
        schema: {
            example: {
                email: "TomHoward77@mail.com",
                password: "Password!1"
            }
        }
    })
    @Post("login")
    async userLogin(@Body() userCredentials: LoginDto): Promise<LoginResponseDto> {
        return await this.authService.userLogin(userCredentials);
    }

}