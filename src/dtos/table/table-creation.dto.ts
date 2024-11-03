import { IsNotEmpty, Min, Max, IsInt } from 'class-validator';

export class TableNumberDto {
  @IsInt()
  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  table_number: number;
}
