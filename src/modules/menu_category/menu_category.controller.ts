import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuCategoryService } from './menu_category.service';
import { CreateMenuCategoryDto } from 'src/dtos/menu/menu_category.dto';

@ApiTags('Menu Categories')
@Controller('menu-category')
export class MenuCategoryController {
  constructor(private readonly menu_category_service: MenuCategoryService) {}

  @Get(':id')
  async getCategories(@Param('id', ParseUUIDPipe) id: string) {
    return await this.menu_category_service.getCategories(id);
  }

  @Post()
  createMenuCategory(
    @Body()
    menuCategory: CreateMenuCategoryDto,
  ) {
    return this.menu_category_service.createMenuCategory(menuCategory);
  }

  @Delete(':id')
  deleteMenuCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.menu_category_service.deleteMenuCategory(id);
  }
}