import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { UpdateOrderDto } from "src/dtos/order/update-order.dto";

@ApiTags("Order")
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @ApiOperation({ summary: "Crea una nueva orden, se necesitan registros de \"Table\" y \"Dish\" guardados previamente" })
    async createOrder(@Body() orderToCreate: CreateOrderDto) {
        return await this.orderService.createOrder(orderToCreate)
    }

    @Put(":id")
    @ApiOperation({ summary: "Modifica una orden en especifico usando su id y los datos que se desean cambiar" })
    @ApiParam({ name: 'id', type: String, description: 'ID de una orden' })
    async updateOrder(@Param("id", ParseUUIDPipe) id: string, @Body() OrderToModify: UpdateOrderDto) {
        return await this.orderService.updateOrder(id, OrderToModify);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Elimina el registro de una orden en especifico usando su id" })
    @ApiParam({ name: 'id', type: String, description: 'ID de una orden' })
    async deleteOrder(@Param("id", ParseUUIDPipe) id: string){
        return await this.orderService.deleteOrder(id);
    }
}
