import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "src/dtos/restaurant/register-restaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { Restaurant } from "src/entities/restaurant.entity";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";
import { RolesGuard } from "src/guards/roles.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { HttpResponseDto } from "src/dtos/http-response.dto";
import { UpdateRestaurant } from "src/dtos/restaurant/updateRestaurant.dto";
import { RestaurantQueryManyDto } from "src/dtos/restaurant/restaurant-query-many.dto";
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { filterNullFields } from "src/utils/objectNullFilter";

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Get('query')
    @ApiOperation({ summary: 'QueryParameter complejo para obtener una lista de restaurantes organizada' })
    @ApiQuery({ name: "page", required: true, type: Number, example: 1, description: "Numero de la pagina" })
    @ApiQuery({ name: "limit", required: true, type: Number, example: 10, description: "Objetos por pagina" })
    @ApiQuery({ name: "rating", required: false, type: Number, example: 4, description: "Rating de restaurantes" })
    @ApiQuery({ name: "search", required: false, type: String, description: "Palabra de busqueda" })
    @ApiOperation({ summary: "QueryParameter complejo para obtener una lista de restaurantes organizada" })
    async getRestaurantsQuery(@Query("page") page: number = 1, @Query("limit") limit: number = 10, @Query("rating") rating?: number, @Query("search") search?: string): Promise<RestaurantQueryManyDto> {
        return await this.restaurantService.getRestaurantsQuery(page, limit, rating, search);
    }

    @Get(':id')
    @ApiParam({name: "id", description: "Id de restaurante"})
    @ApiOperation({ summary: "Obtiene los detalles de un restaurante", description: "Id recibido por parametro" })
    @TryCatchWrapper(HttpMessagesEnum.RESTAURANT_NOT_FOUND, BadRequestException)
    async getRestaurantByid(@Param('id', ParseUUIDPipe) id: string): Promise<Restaurant> {
        return await this.restaurantService.getRestaurantById(id);
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
        return await this.restaurantService.createRestaurant(filterNullFields(restaurantObject));
    }

    @Put("update")
    @Roles(UserRole.MANAGER)
    @UseGuards(RolesGuard, AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Actualiza un restaurante", description: "Id de restaurante y objeto de modificacion" })
    async updateRestaurant(@Param("id", ParseUUIDPipe) id: string, @Body() restaurantObject: UpdateRestaurant): Promise<Restaurant> {
        return await this.restaurantService.updateRestaurant(id, restaurantObject);
    }

    @Delete(':id')
    @Roles(UserRole.MANAGER)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async deleteRestaurant(@Param("id", ParseUUIDPipe) id: string): Promise<HttpResponseDto> {
        return await this.restaurantService.deleteRestaurant(id);
    }
}
