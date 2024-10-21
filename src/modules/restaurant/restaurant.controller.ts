import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "src/dtos/restaurant/register-restaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { Restaurant } from "src/entities/restaurant.entity";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";
import { RolesGuard } from "src/guards/roles.guard";

@ApiTags("Restaurant")
@Controller("restaurant")
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Get("query")
    @ApiOperation({ summary: "QueryParameter complejo para obtener una lista de restaurantes organizada" })
    async getRestaurantsQuery(@Query("page") page: number=1, @Query("limit") limit: number=10, @Query("rating") rating: number, @Query("search") search: string): Promise<any> {
        return await this.restaurantService.getRestaurantsQuery(page,limit,rating,search);
    }

    @Post("create")
    @Roles(UserRole.CONSUMER)
    @UseGuards(RolesGuard)
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
    @ApiOperation({ summary: "registra un nuevo restaurante, con id de usuario y objeto a crear" })
    async createRestaurant(@Param(":id",ParseUUIDPipe) id: string, @Body() restaurantObject: RegisterRestaurantDto): Promise<Restaurant> {
        return await this.restaurantService.createRestaurant(restaurantObject);
    }

    @Put("update")
    @Roles(UserRole.MANAGER)
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: "actualiza un restaurante, con id de restaurante y objeto de modificacion" })
    async updateRestaurant(@Param(":id",ParseUUIDPipe) id: string, @Body() restaurantObject: RegisterRestaurantDto): Promise<any> {
        return null;
    }


    @Get(':id')
    @ApiOperation({summary:"obtiene los detalles de un restaurante,con su id recibido por parametro"})
    async getRestaurantByid(@Param(":id",ParseUUIDPipe) id: string){
    }


    @Delete(':id')
    @Roles(UserRole.MANAGER)
    @UseGuards(RolesGuard)
    deleteRestaurant(@Param(":id",ParseUUIDPipe) id: string){
        
    }
}