import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class OrderedDishesDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number
}