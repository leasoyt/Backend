import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { Menu } from 'src/entities/menu.entity';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) { }

  @Get('list/:restaurantid')
  @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
  @ApiQuery({ name: "sub", required: true, type: Boolean, description: "Categorias o no" })
  @ApiOperation({ summary: "para conseguir el menu con sus categorias (o submenus)", description: "uuid del RESTAURANTE, y queryParam booleano si se quiere devolver con sus categorias" })
  async getMenuWithCategories(@Param('restaurantid', ParseUUIDPipe) restaurantId: string, @Query("sub") sub: boolean): Promise<Menu> {
    
    return sub ?
      await this.menuService.getMenuWithCategories(restaurantId)
      :
      await this.menuService.getMenuByRestaurantId(restaurantId);
  }
}
