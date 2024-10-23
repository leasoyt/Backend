import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards, } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MenuCategoryService } from './menu_category.service';
import { CreateMenuCategoryDto } from 'src/dtos/menu/menu_category.dto';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { MenuCategoryDeletionResult } from 'src/dtos/menu/delete-menu-category.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Menu Categories')
@Controller('menu-category')
export class MenuCategoryController {
  constructor(private readonly menu_category_service: MenuCategoryService) { }

  @Post()
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard,RolesGuard)
  @ApiOperation({ summary: "crear una nueva categoria", description: "se necesita el nombre de la categoria y el id del restaurante" })
  @ApiBody({
    schema: {
      example: {
        restaurant_id: "uuid...",
        name: "Malteadas"
      }
    }
  })
  async createMenuCategory(@Body() menuCategory: CreateMenuCategoryDto): Promise<Omit<Menu_Category, "menu">> {
    return await this.menu_category_service.createMenuCategory(menuCategory);
  }

  @Get(':id')
  @ApiOperation({ summary: "Consigue los platos de una categoria enlistados", description: "uuid de la categoria" })
  async getCategoryAndDishes(@Param('id', ParseUUIDPipe) id: string): Promise<Menu_Category> {
    return await this.menu_category_service.getCategoryAndDishes(id);
  }

  @Delete(':id') 
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard,RolesGuard)
  @ApiOperation({ summary: "Eliminacion de una categoria del menu", description: "uuid de la categoria, !ADVERTENCIA: esto eliminaria a los platos que contiene" })
  async deleteMenuCategory(@Param('id', ParseUUIDPipe) id: string): Promise<MenuCategoryDeletionResult> {
    return await this.menu_category_service.deleteMenuCategory(id);
  }
}
