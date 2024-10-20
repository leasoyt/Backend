import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";

@ApiTags("Order")
@Controller('order')
export class OrderController {
    constructor(private readonly dishService: OrderService) {}

    // @Get(":id")
    // async getUser(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
    //     return await this.userService.getUserById(id);
    // }
    @Post()
    async createOrder(@Body() orderToCreate: CreateOrderDto) {
        return await this.dishService.createOrder(orderToCreate)
    }
    // @Put(":id")
    // async updateDish(@Param("id", ParseUUIDPipe) id: string, @Body() dishToModify: UpdateDish): Promise<any> {
    //     return await this.dishService.updateDish(id, dishToModify);
    // }

    // @Delete(":id")
    // async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
    //     return await this.dishService.deleteDish(id);
    // }
}
