import { BadRequestException, Body, Controller, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SanitizedUserDto } from "src/dtos/user/sanitized-user.dto";
import { RegisterDto } from "../../dtos/auth/register.dto";
import { LoginDto } from "src/dtos/auth/login.dto";
import { LoginResponseDto } from "src/dtos/auth/login-response.dto";
import { UpdatePasswordDto } from "src/dtos/user/update-password.dto";
import { isNotEmptyObject } from "class-validator";
import { AuthGuard } from "src/guards/auth.guard";
import { HttpResponseDto } from "src/dtos/http-response.dto";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({
    schema: {
      example: {
        name: 'Tom howard',
        email: 'TomHoward77@mail.com',
        password: 'Password!1',
        confirmPassword: 'Password!1',
        country: 'Francia',
      },
    },
  })
  @ApiOperation({ summary: 'registro de usuario' })
  async userRegistration(@Body() userObject: RegisterDto): Promise<SanitizedUserDto> {
    const created_user = await this.authService.userRegistration(userObject);
    return created_user;
  }

  @Post('login')
  @ApiBody({
    schema: {
      example: {
        email: 'TomHoward77@mail.com',
        password: 'Password!1',
      },
    },
  })
  @ApiOperation({ summary: 'Login de usuario' })
  async userLogin(@Body() userCredentials: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.userLogin(userCredentials);
  }

  @Put("updatePassword/:id")
  @ApiBody({
    schema: {
      example: {
        password: "Hellyea42!",
        confirmPassword: "Hellyea42!",
        old_password: "Password!1"
      }
    }
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "actualiza la contraseña", description: "uuid de usuario y body de cambio de contraseña" })
  async updatePassword(@Param("id", ParseUUIDPipe) id: string, @Body() passwordModification: UpdatePasswordDto): Promise<HttpResponseDto> {

    if (!isNotEmptyObject(passwordModification)) {
      throw new BadRequestException("body values are empty");
    }

    await this.authService.updateAndHashPassword(id, passwordModification);

    return { message: HttpMessagesEnum.PASSWORD_UPDATE_SUCCESS }
  }

}
