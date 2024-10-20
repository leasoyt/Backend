import { PartialType } from "@nestjs/swagger";
import { Waiter } from "./waiter.dto";

export class UpdateWaiterDto extends PartialType(Waiter){}