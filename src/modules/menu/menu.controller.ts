import { Controller, Get, Param, ParseUUIDPipe, Post, } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { Menu } from 'src/entities/menu.entity';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }
  
  @Get(':id')
  @ApiOperation({summary: "para conseguir un menu", description: "se necesita el id del restaurante"})
  async getMenu(@Param('id', ParseUUIDPipe) restaurantId: string): Promise<Menu> {
    return await this.menuService.getMenu(restaurantId);
  }
  
  @Post('create/:id')
  @ApiOperation({summary: "crear un nuevo menu", description: "solo necesita la uuid del restaurante"})
  async createMenu(@Param('id', ParseUUIDPipe) restaurantId: string): Promise<Menu> {
    return await this.menuService.createMenu(restaurantId);
  }

}
