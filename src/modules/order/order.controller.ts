import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
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
    @ApiOperation({ summary: "Crea una nueva orden, se necesitan registros de \"Table\" y \"Dish\" guardados previamente" })
    async createOrder(@Body() orderToCreate: CreateOrderDto) {
        return await this.orderService.createOrder(orderToCreate)
    }
    @Put(":id")
    @ApiOperation({ summary: "Devuelve una orden en específico, si es que existe, utilizando su id" })
    async updateOrder(@Param("id", ParseUUIDPipe) id: string, @Body() OrderToModify: UpdateOrderDto) {
        return await this.orderService.updateOrder(id, OrderToModify);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Elimina el registro de una orden es especifico usando su id" })
    async deleteOrder(@Param("id", ParseUUIDPipe) id: string){
        return await this.orderService.deleteOrder(id);
    }
}
