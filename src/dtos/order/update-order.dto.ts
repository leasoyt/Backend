import { IntersectionType, OmitType, PartialType } from "@nestjs/swagger";
import { CreateOrderDto } from "./create-order.dto";
import { OrderStatusDto } from "./order-status.dto";

export class UpdateOrderDto extends PartialType(IntersectionType(OmitType(CreateOrderDto, ['table'] as const), OrderStatusDto)) { }