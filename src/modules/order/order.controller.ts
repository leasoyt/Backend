import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { UpdateOrderDto } from "src/dtos/order/update-order.dto";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @Roles(UserRole.CONSUMER, UserRole.MANAGER)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBody({
        schema: {
            example: {
                table: "uuid...",
                ordered_dishes: [
                    { id: '15052f70-2c24-4516-be44-673ec4876788', quantity: 3 },
                    { id: '23456e70-2c24-4516-be44-673ec4876789', quantity: 2 }
                ]
            }
        }
    })
    @ApiOperation({ summary: "Crea una nueva orden ", description: "se necesitan registros de \"Table\" y \"Dish\" guardados previamente" })
    async createOrder(@Body() orderToCreate: CreateOrderDto) {
        return await this.orderService.createOrder(orderToCreate);
    }

    @Put(':id')
    @Roles(UserRole.CONSUMER, UserRole.MANAGER)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({
        summary:
            'Modifica una orden en especifico usando su id y los datos que se desean cambiar',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID de una orden' })
    async updateOrder(@Param('id', ParseUUIDPipe) id: string, @Body() OrderToModify: UpdateOrderDto) {
        return await this.orderService.updateOrder(id, OrderToModify);
    }

    @Delete(':id')
    @Roles(UserRole.MANAGER, UserRole.CONSUMER)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({ summary: "Elimina el registro de una orden en especifico usando su id" })
    @ApiParam({ name: 'id', type: String, description: 'ID de una orden' })
    async deleteOrder(@Param('id', ParseUUIDPipe) id: string) {
        return await this.orderService.deleteOrder(id);
    }

}
