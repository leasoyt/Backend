import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DishService } from "./dish.service";
import { CreateDishDto } from "src/dtos/dish/create-dish.dto";
import { UpdateDishDto } from "src/dtos/dish/update-dish.dto";
import { DishDeletionResultDto } from "src/dtos/dish/delete-dish-result.dto";
import { Dish } from "src/entities/dish.entity";

@ApiTags("Dishes")
@Controller('dish')
export class DishController {
    constructor(private readonly dishService: DishService) { }

    @Get(":id")
    async getDishById(@Param("id", ParseUUIDPipe) id: string): Promise<Dish> {
        return await this.dishService.getDishById(id);
    }

    @Post()
    @ApiOperation({summary: "crear platillos nuevos", description: "Se necesita la uuid de la categoria"})
    @ApiBody({
        schema: {
            example: {
                name: "banana split",
                price: 200.40,
                description: "descripcion aqui",
                category: "aaeea451-cdd4-462e-b8b7-11254929ad54"
            }
        }
    })
    async createDish(@Body() dishToCreate: CreateDishDto): Promise<Omit<Dish, "category">> {
        return await this.dishService.createDish(dishToCreate);
    }

    @Put(":id")
    @ApiOperation({summary: "actualizar informacion de platillos", description: "Se necesita la uuid del plato"})
    @ApiBody({
        schema: {
            example: {
                name: "Macarrones con queso",
                price: 550.90,
                description: "otra descripcion aqui",
            }
        }
    })
    async updateDish(@Param("id", ParseUUIDPipe) id: string, @Body() dishToModify: UpdateDishDto): Promise<Dish> {
        return await this.dishService.updateDish(id, dishToModify);
    }

    @Delete(":id")
    async deleteDish(@Param("id", ParseUUIDPipe) id: string): Promise<DishDeletionResultDto> {
        return await this.dishService.deleteDish(id);
    }
}
