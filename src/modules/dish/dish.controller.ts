import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DishService } from "./dish.service";
import { CreateDishDto } from "src/dtos/dish/create-dish.dto";
import { UpdateDishDto } from "src/dtos/dish/update-dish.dto";
import { HttpResponseDto } from "src/dtos/http-response.dto";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { Dish } from "src/entities/dish.entity";
import { AuthGuard as Auth0Guard } from "@nestjs/passport";
import { RolesAuth0Guard } from "src/guards/roles-auth0.guard"
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";
import { AuthGuard } from "src/guards/auth.guard";

@ApiTags("Dishes")
@Controller('dish')
export class DishController {
    constructor(private readonly dishService: DishService) { }


    // Protección para la autenticación y por roles de Auth0
    // @UseGuards(Auth0Guard('jwt'), RolesAuth0Guard)
    @ApiOperation({summary: "consigue toda la info de un platillo", description: "Se necesita la uuid del platillo"})
    // @Roles(UserRole.MANAGER)
    @Get(":id")
    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    @ApiOperation({ summary: "consigue toda la info de un platillo", description: "Se necesita la uuid del platillo" })
    async getDishById(@Param("id", ParseUUIDPipe) id: string): Promise<Dish> {
        return await this.dishService.getDishById(id);

    }

    @Post()
    // @ApiBearerAuth()
    // @Roles(UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    @ApiOperation({ summary: "crear platillos nuevos", description: "Se necesita la uuid de la categoria y el objeto a crear" })
    @ApiBody({
        schema: {
            example: {
                name: "banana split",
                price: "200.40",
                description: "descripcion aqui",
                category: "aaeea451-cdd4-462e-b8b7-11254929ad54"
            }
        }
    })
    async createDish(@Body() dishToCreate: CreateDishDto): Promise<Omit<Dish, "category">> {
        return await this.dishService.createDish(dishToCreate);
    }

    @Put(":id")
    // @ApiBearerAuth()
    // @Roles(UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    @ApiOperation({ summary: "actualizar informacion de platillos", description: "Se necesita la uuid del plato" })
    @ApiBody({
        schema: {
            example: {
                name: "Macarrones con queso",
                price: "550.90",
                description: "otra descripcion aqui",
            }
        }
    })
    async updateDish(@Param("id", ParseUUIDPipe) id: string, @Body() dishToModify: UpdateDishDto): Promise<Dish> {
        return await this.dishService.updateDish(id, dishToModify);
    }

    @Delete(":id")
    // @ApiBearerAuth()
    // @Roles(UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    async deleteDish(@Param("id", ParseUUIDPipe) id: string): Promise<HttpResponseDto> {
        return await this.dishService.deleteDish(id);
    }
}
