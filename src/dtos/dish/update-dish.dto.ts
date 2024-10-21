import { IsOptional, IsString, IsBoolean, IsDecimal, IsUUID } from 'class-validator';

export class UpdateDishDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  stock?: boolean;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsUUID()
  category?: string; 
}
