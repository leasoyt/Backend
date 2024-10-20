import { Controller, Get, Param, ParseUUIDPipe, Post, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { Menu } from 'src/entities/menu.entity';

@ApiTags('Restaurant Menus')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }
  
  @Get(':id')
  async getMenu(@Param('id', ParseUUIDPipe) menuId: string): Promise<Menu> {
    return await this.menuService.getMenu(menuId);
  }
  
  @Post('create/:id')
  async createMenu(@Param('id', ParseUUIDPipe) restaurantId: string): Promise<Menu> {
    return await this.menuService.createMenu(restaurantId);
  }

}
