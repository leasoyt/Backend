import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UserService } from './user.service';
import { isNotEmpty, isNotEmptyObject } from 'class-validator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SanitizedUserDto } from 'src/dtos/user/sanitized-user.dto';
import { CustomMessagesEnum } from 'src/dtos/custom-responses.dto';
import { UserRole } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'usuario con privilegios de admin obtiene todos los usuarios',
  })
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.getUsers(page, limit);
  }

//   @ApiBearerAuth()
//   @Get('profile/:id')
//   @UseGuards(AuthGuard)
//   @ApiOperation({
//     summary: 'obtener el perfil del usuario autenticado',
//     description: 'Obtiene los datos del usuario logueado',
//   })
//   async getProfile(
//     @Req() req: Request,
//   ) {
//   console.log(req)
//   }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'obtiene un usuario por su id' })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SanitizedUserDto> {
    return await this.userService.getUserById(id);
  }



  @ApiBearerAuth()
  @Put(':id')
  @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  @UseGuards(AuthGuard, RolesGuard)
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
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() modified_user: UpdateUserDto,
  ): Promise<SanitizedUserDto> {
    if (!isNotEmptyObject(modified_user)) {
      throw new BadRequestException({
        message: CustomMessagesEnum.UPDATE_USER_FAILED,
        error: 'body values are empty',
      });
    }

    if (isNotEmpty(modified_user.password)) {
      throw new BadRequestException({
        message: CustomMessagesEnum.UPDATE_USER_FAILED,
        error: "You can't modify passwords in this endpoint!",
      });
    }

    return await this.userService.updateUser(id, modified_user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'elimina un usuario por su id (posiblemente no se vaya a usar)',
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return 'mala idea';
    // return await this.userService.deleteUser(id);
  }
}
