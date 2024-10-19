import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from 'src/dtos/menu/create-menu.dto';

@ApiTags('Restaurant Menus')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('createMenu/for/:restaurantId')
  createMenu(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Body() menu: CreateMenuDto,
  ) {
    return this.menuService.createMenu(menu, restaurantId);
  }

  @Get('getMenu/for/:restaurantId')
  getMenu( @Param('restaurantId', ParseUUIDPipe) restaurantId: string) {
    return this.menuService.getMenu(restaurantId)
  }
}
