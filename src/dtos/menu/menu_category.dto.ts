import { IsNotEmpty, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDishDto } from '../dish/create-dish.dto';

export class CreateMenuCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  menuId: string;

  @IsString()
  @Length(1, 20)
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDishDto)
  dishes: CreateDishDto[];
}
