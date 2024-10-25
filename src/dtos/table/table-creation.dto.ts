import { IsUUID, IsNotEmpty, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { TableStatus } from 'src/enums/tableStatus.enum';

export class TableCreationDto {
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  table_number: number;  // Número de la mesa, obligatorio y numérico

  // @IsEnum(TableStatus)
  // @IsNotEmpty()
  // status: TableStatus;  // Estado de la mesa, obligatorio

  @IsUUID()
  @IsNotEmpty()
  restaurant_id: string;  // ID del restaurante al que pertenece la mesa, obligatorio
}
