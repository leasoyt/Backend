import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMenuCategoryDto } from './menu_category.dto';

export class CreateMenuDto {
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;

  @IsString()
  @IsNotEmpty()
  name: string = 'menu';

  @ValidateNested({ each: true })
  @Type(() => CreateMenuCategoryDto)
  categories: CreateMenuCategoryDto[];
}
