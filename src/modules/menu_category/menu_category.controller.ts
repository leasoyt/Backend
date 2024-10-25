import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MenuCategoryService } from './menu_category.service';
import { CreateMenuCategoryDto } from 'src/dtos/menu/menu_category.dto';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { HandleError } from 'src/decorators/generic-error.decorator';
import { HttpResponseDto } from 'src/dtos/http-response.dto';
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";

@ApiTags('Menu Categories')
@Controller('menu-category')
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) { }

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
    return await this.menuCategoryService.createMenuCategory(menuCategory);
  }

  @Get(':id')
  @HandleError(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
  @ApiOperation({ summary: "Consigue los platos de una categoria enlistados", description: "uuid de la categoria" })
  async getCategoryAndDishes(@Param('id', ParseUUIDPipe) id: string): Promise<Menu_Category> {
    return await this.menuCategoryService.getCategoryAndDishes(id);
  }

  @Delete(':id') 
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard,RolesGuard)
  @ApiOperation({ summary: "Eliminacion de una categoria del menu", description: "uuid de la categoria, !ADVERTENCIA: esto eliminaria a los platos que contiene" })
  async deleteMenuCategory(@Param('id', ParseUUIDPipe) id: string): Promise<HttpResponseDto> {
    return await this.menuCategoryService.deleteMenuCategory(id);
  }
}
