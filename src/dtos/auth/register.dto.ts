import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { RegisterRestaurantDto } from '../restaurant/register-restaurant.dto';
import { Type } from 'class-transformer';
import { MatchPassword } from 'src/validators/matchPassword.validator';
import { UserRole } from 'src/enums/roles.enum';
/**
 * Dto: Registro de usuarios en general
 */
export class RegisterDto {
  @IsNotEmpty()
  @Length(3, 80)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 80)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]/,
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*), and be more than 8 characters.',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @IsOptional()
  @IsUrl()
  profile_image?: string;

  @IsOptional()
  @Length(3, 50)
  country?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterRestaurantDto)
  establishment?: RegisterRestaurantDto;

  @IsOptional()
  role?: UserRole;
}
