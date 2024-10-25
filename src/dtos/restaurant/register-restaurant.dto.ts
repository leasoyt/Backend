import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateRestaurantScheduleDto } from './createRestaurantSchedule.dto';
import { TableCreationDto } from '../table/table-creation.dto';

export class RegisterRestaurantDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  name: string;

  @IsNotEmpty()
  @Length(5, 30)
  address: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;

  @IsUUID()
  @IsOptional()
  future_manager: string;

  // Array de horarios del restaurante
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateRestaurantScheduleDto) // Indica que debe validar un array de DTOs de horario
  schedules?: CreateRestaurantScheduleDto[];
  
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => TableCreationDto)
  tables?: TableCreationDto[];
}
