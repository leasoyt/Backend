import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UserService } from './user.service';
import { isNotEmpty, isNotEmptyObject } from 'class-validator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SanitizedUserDto } from 'src/dtos/user/sanitized-user.dto';
import { UserRole } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';
import { UuidBodyDto } from 'src/dtos/generic-uuid-body.dto';
import { HttpResponseDto } from 'src/dtos/http-response.dto';
import { User } from 'src/entities/user.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { CustomHttpException } from 'src/helpers/custom-error-class';

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }


  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'obtiene todos los usuarios',
    description: 'debe ser ejecutado por un usuario con rol admin',
  })
  async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 100): Promise<SanitizedUserDto[]> {
    return await this.userService.getUsers(page, limit);
  }


  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'obtiene la informacion de perfil de usuario', description: 'solo el header del mismo usuario' })
  async getProfile(@GetUser() user: any): Promise<SanitizedUserDto> {
    if (!user || !user.id) {
      throw new CustomHttpException(HttpMessagesEnum.UNAUTHORIZED, UnauthorizedException).throw;
    }

    return await this.userService.getUserById(user.id);
  }


  @Put('rankup')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.CONSUMER, UserRole.MANAGER)
  @ApiBody({
    schema: {
      example: {
        id: 'uuid...',
        rank: 'manager',
      },
    },
  })
  @ApiOperation({ summary: 'Actualiza el rango de un usuario', description: 'id y rango valido manager | consumer | admin | waiter' })
  async rankUp(@Body() body: UuidBodyDto & { rank: UserRole }): Promise<HttpResponseDto> {
    const ranked_up: User = await this.userService.rankUpTo(body.id, body.rank);

    if (ranked_up.role === body.rank) {
      return { message: HttpMessagesEnum.RANKING_UP_SUCCESS };
    }

    throw new CustomHttpException(HttpMessagesEnum.RANKING_UP_FAIL, BadRequestException).throw;

  }


  @Get(':id')
  @ApiOperation({ summary: 'obtiene un usuario por su id' })
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<SanitizedUserDto> {
    return await this.userService.getUserById(id);
  }


  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'actualiza la informacion de un usuario, por id y body',
    description: 'uuid de user y objeto a actualizar',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Tim Haward',
        country: 'Noruega',
      },
    },
  })
  async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() modified_user: UpdateUserDto): Promise<SanitizedUserDto> {

    if (!isNotEmptyObject(modified_user)) {
      // throw new BadRequestException({ message: HttpMessagesEnum.USER_UPDATE_FAILED, error: 'body values are empty', });
      throw new CustomHttpException(HttpMessagesEnum.USER_UPDATE_FAILED, BadRequestException, "body values are empty").throw;
    }

    if (isNotEmpty(modified_user.password)) {
      // throw { message: HttpMessagesEnum.USER_UPDATE_FAILED, exception: BadRequestException, };
      throw new CustomHttpException(HttpMessagesEnum.USER_UPDATE_FAILED, BadRequestException, "password can't be updated from this endpoint").throw;
    }

    return await this.userService.updateUser(id, modified_user);
  }


  @Put('ban-unban/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Agrega o quita un soft delete a un usuario',
    description:
      'recibe el id de un usuario por parametro y actualiza el estado de softdelete del usuario',
  })
  async banOrUnbanUser(@Param('id', ParseUUIDPipe) id: string): Promise<HttpResponseDto> {
    return this.userService.banOrUnbanUser(id);
  }

}
