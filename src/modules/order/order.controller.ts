import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { UpdateOrderDto } from "src/dtos/order/update-order.dto";

@ApiTags("Order")
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // @Get(":id")
    // async getUser(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
    //     return await this.userService.getUserById(id);
    // }
    @Post()
    async createOrder(@Body() orderToCreate: CreateOrderDto) {
        return await this.orderService.createOrder(orderToCreate)
    }
    @Put(":id")
    async updateOrder(@Param("id", ParseUUIDPipe) id: string, @Body() OrderToModify: UpdateOrderDto) {
        return await this.orderService.updateOrder(id, OrderToModify);
    }

    @Delete(":id")
    async deleteOrder(@Param("id", ParseUUIDPipe) id: string){
        return await this.orderService.deleteOrder(id);
    }
}
