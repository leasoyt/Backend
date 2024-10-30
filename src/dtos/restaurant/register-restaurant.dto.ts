import {  IsNotEmpty,  IsOptional,  IsString,  IsUrl,  IsUUID,  Length,} from 'class-validator';

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

  @IsUUID() //NUNCA DEBE SER NULO
  @IsNotEmpty()
  future_manager: string;

}
