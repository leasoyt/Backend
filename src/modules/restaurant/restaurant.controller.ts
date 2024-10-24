import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "src/dtos/restaurant/register-restaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { Restaurant } from "src/entities/restaurant.entity";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";
import { RolesGuard } from "src/guards/roles.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { HttpResponseDto } from "src/dtos/http-response.dto";

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Get('query')
    @ApiOperation({ summary: 'QueryParameter complejo para obtener una lista de restaurantes organizada' })
    @Get("query")
    @ApiOperation({ summary: "QueryParameter complejo para obtener una lista de restaurantes organizada" })
    async getRestaurantsQuery(@Query("page") page: number = 1, @Query("limit") limit: number = 10, @Query("rating") rating: number, @Query("search") search: string): Promise<any> {
        return await this.restaurantService.getRestaurantsQuery(page, limit, rating, search);
    }

    @Post("create")
    @Roles(UserRole.CONSUMER)
    @UseGuards(RolesGuard, AuthGuard)
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                name: "name here",
                address: "123 Street boulevard",
                description: "descriptive description of my establishment",
                future_manager: "uuid..."
            }
        }
    })
    @ApiOperation({ summary: "Registra un nuevo restaurante", description: "Id de usuario y objeto a crear" })
    async createRestaurant(@Body() restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
        return await this.restaurantService.createRestaurant(restaurantObject);
    }

    @Put("update")
    @Roles(UserRole.MANAGER)
    @UseGuards(RolesGuard, AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Actualiza un restaurante", description: "Id de restaurante y objeto de modificacion" })
    async updateRestaurant(@Param(":id", ParseUUIDPipe) id: string, @Body() restaurantObject: RegisterRestaurantDto): Promise<any> {
        return null;
    }

    @Get(':id')
    @ApiOperation({ summary: "Obtiene los detalles de un restaurante", description: "Id recibido por parametro" })
    async getRestaurantByid(@Param(":id", ParseUUIDPipe) id: string): Promise<Restaurant> {
        return await this.restaurantService.getRestaurantById(id);
    }

    @Delete(':id')
    @Roles(UserRole.MANAGER)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    deleteRestaurant(@Param(":id", ParseUUIDPipe) id: string): Promise<HttpResponseDto> {
        return this.restaurantService.deleteRestaurant(id);
    }
}
