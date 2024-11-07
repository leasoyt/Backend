import { Body, Controller, Post } from "@nestjs/common";
import { UserAuthService } from "./user-auth.service";
import { AuthRequestDto } from "src/dtos/auth/auth0.request.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginResponseDto } from "src/dtos/auth/login-response.dto";

@ApiTags("Auth0 authentication")
@Controller("auth-zero")
export class UserAuthController {

    constructor(private readonly userAuthService: UserAuthService) { }

    @Post("loginOrRegister")
    @ApiBody({
        schema: {
            example: {
                name: "nombre entregado por auth0",
                picture: "profile image entregada por auth0",
                email: "email@mail.com",
                sub: "[subject id entregado por auth0]",
            }
        }
    })
    @ApiOperation({
        summary: "login o registro por auth0",
        description: "verifica automaticamente si es un usuario registrado, si no lo registra"
    })
    async loginWithAuth(@Body() obj: AuthRequestDto): Promise<LoginResponseDto> {
        return await this.userAuthService.loginWithAuth(obj);
    }

    // @Post("register")
    // @ApiBody({
    //     schema: {
    //         example: {
    //             name: "nombre entregado por auth0",
    //             picture: "profile image entregada por auth0",
    //             email: "email@mail.com",
    //             sub: "[subject id entregado por auth0]",
    //         }
    //     }
    // })
    // @ApiOperation({ summary: "registro por auth0" })
    // async registerWithAuth(@Body() obj: AuthRequestDto): Promise<SanitizedUserDto> {
    //     const created_user = await this.userAuthService.registerWithAuth(obj);
    //     return created_user;
    // }

}