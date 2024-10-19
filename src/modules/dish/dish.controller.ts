import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DishService } from "./dish.service";
import { CreateDishDto } from "src/dtos/dish/create-dish.dto";
import { UpdateDish } from "src/dtos/dish/update-dish.dto";

@ApiTags("User")
@Controller('dish')
export class DishController {
    constructor(private readonly dishService: DishService) { }

    @Post()
    async createDish(@Body() dishToCreate: CreateDishDto) {
        return await this.dishService.createDish(dishToCreate)
    }

    @Put(":id")
    async updateDish(@Param("id", ParseUUIDPipe) id: string, @Body() dishToModify: UpdateDish): Promise<any> {
        return await this.dishService.updateDish(id, dishToModify);
    }

    @Delete(":id")
    async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
        return await this.dishService.deleteDish(id);
    }
}