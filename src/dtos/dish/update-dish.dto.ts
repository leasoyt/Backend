import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDishDto } from './create-dish.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDishDto extends PartialType(OmitType(CreateDishDto, ["category", "imgUrl"])) {
    
    @IsOptional()
    @IsBoolean()
    stock: boolean
}
