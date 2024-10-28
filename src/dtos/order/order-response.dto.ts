import { IsNumber } from "class-validator";
import { Order } from "src/entities/order.entity";

export class OrderResponseDto extends Order {
    @IsNumber()
    table_id: number;
}