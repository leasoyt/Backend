import { IntersectionType, OmitType, PartialType } from "@nestjs/swagger";
import { CreateOrderDto } from "./create-order.dto";
import { AditionalInfoToUpdateOrder } from "./aditionalInfoToUpdateOrder.dto";

export class UpdateOrderDto extends PartialType(IntersectionType(
  OmitType(CreateOrderDto, ['table'] as const),
  AditionalInfoToUpdateOrder
)){}