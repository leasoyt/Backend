import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { Menu } from 'src/entities/menu.entity';
import { CreateMenuDto } from 'src/dtos/menu/create-menu.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }
  
  @Get('withDishes/:restaurantId')
  async getMenuWithDishes(@Param('restaurantId', ParseUUIDPipe) restaurantId: string): Promise<Menu> {
    return await this.menuService.getMenuWithDishes(restaurantId);
  }


  @Post()
  async createMenu(@Body() menu:CreateMenuDto): Promise<Menu> {
    return  this.menuService.createMenu(menu);
  }
  
  @Get(':id')
  getMenuById(@Param('id', ParseUUIDPipe) id: string){
    return this.menuService.getMenuById(id)
  @ApiOperation({summary: "para conseguir un menu", description: "se necesita el id del restaurante"})
  async getMenu(@Param('id', ParseUUIDPipe) restaurantId: string): Promise<Menu> {
    return await this.menuService.getMenu(restaurantId);
  }


  @Delete(':id')
  deleteMenu(@Param('id',ParseUUIDPipe) id:string){
    return this.menuService.deleteMenu(id)
  
  @Post('create/:id')
  @ApiOperation({summary: "crear un nuevo menu", description: "solo necesita la uuid del restaurante"})
  async createMenu(@Param('id', ParseUUIDPipe) restaurantId: string): Promise<Menu> {
    return await this.menuService.createMenu(restaurantId);
  }

}
