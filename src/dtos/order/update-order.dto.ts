import { PartialType } from "@nestjs/swagger";
import { CreateOrderRDto } from "./create-order.dto";

export class UpdateOrderDto extends PartialType(CreateOrderRDto){}