import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DishService } from "./dish.service";
import { CreateDishDto } from "src/dtos/dish/create-dish.dto";
import { UpdateDishDto } from "src/dtos/dish/update-dish.dto";
import { CustomResponseDto } from "src/dtos/custom-responses.dto";
import { Dish } from "src/entities/dish.entity";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";

@ApiTags("Dishes")
@Controller('dish')
export class DishController {
    constructor(private readonly dishService: DishService) { }

    @Get(":id")
    @ApiOperation({summary: "consigue toda la info de un platillo", description: "Se necesita la uuid del platillo"})
    async getDishById(@Param("id", ParseUUIDPipe) id: string): Promise<Dish> {
        return await this.dishService.getDishErrorHandled(id);
    }

    @Post()
    @Roles(UserRole.MANAGER)
    @UseGuards(AuthGuard,RolesGuard)
    @ApiOperation({summary: "crear platillos nuevos", description: "Se necesita la uuid de la categoria y el objeto a crear"})
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
    @Roles(UserRole.MANAGER)
    @UseGuards(AuthGuard,RolesGuard)
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
    @Roles(UserRole.MANAGER)
    @UseGuards(AuthGuard,RolesGuard)
    async deleteDish(@Param("id", ParseUUIDPipe) id: string): Promise<CustomResponseDto> {
        return await this.dishService.deleteDish(id);
    }
}
