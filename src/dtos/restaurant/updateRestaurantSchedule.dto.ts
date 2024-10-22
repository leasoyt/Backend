import { PartialType } from "@nestjs/swagger";
import { CreateRestaurantScheduleDto } from "./createRestaurantSchedule.dto";

export class UpdateRestaurantSchedule extends PartialType(CreateRestaurantScheduleDto){}