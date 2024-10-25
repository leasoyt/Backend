import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { Menu } from 'src/entities/menu.entity';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) { }

  @Get('list/:restaurantid')
  @ApiQuery({ name: "sub", required: true, type: Boolean, description: "Categorias o no" })
  @ApiOperation({ summary: "para conseguir el menu con sus categorias (o submenus)", description: "uuid del RESTAURANTE, y queryParam booleano si se quiere devolver con sus categorias" })
  async getMenuWithCategories(@Param('restaurantid', ParseUUIDPipe) restaurantId: string, @Query("sub") sub: boolean): Promise<Menu> {
    
    return sub ?
      await this.menuService.getMenuWithCategories(restaurantId)
      :
      await this.menuService.getMenuByRestaurantId(restaurantId);
  }
}
