import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { DayOfWeek } from 'src/enums/dayOfWeek.enum';

export class CreateRestaurantScheduleDto {
  @IsUUID('4', { message: 'El ID del restaurante debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El restaurante es obligatorio' })
  restaurantId: string;

  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean;

  @IsEnum(DayOfWeek, { message: 'El día de la semana es inválido' })
  @IsNotEmpty({ message: 'El día de la semana es obligatorio' })
  dayOfWeek: DayOfWeek;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'La hora de apertura debe estar en formato HH:mm',
  })
  @IsNotEmpty({ message: 'La hora de apertura es obligatoria' })
  openingTime: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'La hora de cierre debe estar en formato HH:mm',
  })
  @IsNotEmpty({ message: 'La hora de cierre es obligatoria' })
  closingTime: string;
}
