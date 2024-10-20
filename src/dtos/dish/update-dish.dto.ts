import { CreateDishDto } from "./create-dish.dto";

export type UpdateDishDto = Partial<Omit<CreateDishDto, "menu">>