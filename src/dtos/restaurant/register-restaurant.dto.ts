import {  IsNotEmpty,  IsOptional,  IsString,  IsUrl,  IsUUID,  Length,} from 'class-validator';

export class RegisterRestaurantDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  name: string;

  @IsNotEmpty()
  @Length(5, 40)
  address: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  description?: string;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;

  @IsUUID() //NUNCA DEBE SER NULO
  @IsNotEmpty()
  future_manager: string;

}
