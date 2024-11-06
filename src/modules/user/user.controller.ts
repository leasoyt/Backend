import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UserService } from './user.service';
import { isNotEmpty, isNotEmptyObject } from 'class-validator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SanitizedUserDto } from 'src/dtos/user/sanitized-user.dto';
import { UserRole } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';
import { UserProfileDto } from 'src/dtos/user/profile-user.dto';
import { UuidBodyDto } from 'src/dtos/generic-uuid-body.dto';
import { HttpResponseDto } from 'src/dtos/http-response.dto';
import { User } from 'src/entities/user.entity';
import { GetUser } from 'src/decorators/get-user.decorator';

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

  // Sólo para probar la asignación de roles de Auth0

  // @Get('assignAuth0rol')
  // async assignRoleUser(@Param("id") id: string, @Body() rol: any){
  //     return await this.userService.assignRoleUser(id, rol)
  // }npm

  @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user: any): Promise<UserProfileDto> {
    try {
      console.log('User:', user); // Imprime el objeto user
      if (!user) {
        throw new UnauthorizedException('Usuario no autenticado');
      }
      return await this.userService.getUserById(user.id);
    } catch (error) {
      console.error('Error en getProfile:', error);
      throw new InternalServerErrorException(
        'Error al obtener el perfil del usuario',
      );
    }
  }

  @Put('rankup')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.CONSUMER)
  @ApiBody({
    schema: {
      example: {
        id: 'uuid...',
        rank: UserRole,
      },
    },
  })
  async rankUp(@Body() body: UuidBodyDto & { rank: UserRole }): Promise<HttpResponseDto> {

    const ranked_up: User = await this.userService.rankUpTo(body.id, body.rank);
    if (ranked_up.role === body.rank) {
      return { message: HttpMessagesEnum.RANKING_UP_SUCCESS };
    }
    return { message: HttpMessagesEnum.RANKING_UP_FAIL };
  }

  // Parace no tener uso 
  // @ApiBearerAuth()
  // @ApiBearerAuth()
  @Get(':id')
  // @UseGuards(AuthGuard)
  // @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'obtiene un usuario por su id' })
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<SanitizedUserDto> {
    return await this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(UserRole.MANAGER, UserRole.CONSUMER, UserRole.ADMIN)
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
      throw new BadRequestException({
        message: HttpMessagesEnum.USER_UPDATE_FAILED,
        error: 'body values are empty',
      });
    }

    if (isNotEmpty(modified_user.password)) {
      throw { message: HttpMessagesEnum.USER_UPDATE_FAILED, exception: BadRequestException };
    }

    return await this.userService.updateUser(id, modified_user);
  }

  @Put('deactivate/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Hace un soft delete a un usuario',
    description: 'recibe el id de un usuario por parametro y le hace un soft delete',
  })
  async deactivateUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deactivateUser(id)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'elimina un usuario por su id (posiblemente no se vaya a usar)',
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return 'mala idea ' + id;
    // return await this.userService.deleteUser(id);
  }
}
