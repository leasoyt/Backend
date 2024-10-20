import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { RegisterRestaurantDto } from "src/dtos/restaurant/register-restaurant.dto";
import { Restaurant } from "src/entities/restaurant.entity";

@Controller("restaurant")
export class RestaurantController {

    @Get("query")
    @ApiOperation({ summary: "QueryParameter complejo para obtener una lista de restaurantes organizada" })
    async getRestaurantsQuery(@Query("page") page: number, @Query("limit") limit: number, @Query("rating") rating: number, @Query("search") search: string): Promise<any> {
        return null;
    }

    @Post("create")
    @ApiOperation({ summary: "registra un nuevo restaurante, con id de usuario y objeto a crear" })
    async createRestaurant(@Param(":id") id: ParseUUIDPipe, @Body() restaurantObject: RegisterRestaurantDto): Promise<any> {
        return null;
    }

    @Put("update")
    @ApiOperation({ summary: "actualiza un restaurante, con id de restaurante y objeto de modificacion" })
    async updateRestaurant(@Param(":id") id: ParseUUIDPipe, @Body() restaurantObject: RegisterRestaurantDto): Promise<any> {
        return null;
    }
}