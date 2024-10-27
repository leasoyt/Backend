import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class TableNumberDto {
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  table_number: number;
}
