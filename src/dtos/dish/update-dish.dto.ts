import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateDishDto } from "./create-dish.dto";

export class UpdateDish extends PartialType(CreateDishDto){}