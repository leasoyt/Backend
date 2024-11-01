import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/roles.enum";
import { AuthGuard } from "src/guards/auth.guard";
import { Order } from "src/entities/order.entity";
import { HttpResponseDto } from "src/dtos/http-response.dto";
import { OrderStatusDto } from "src/dtos/order/order-status.dto";
import { OrderResponseDto } from "src/dtos/order/order-response.dto";

@ApiTags('Order')
@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post()
    // @Roles(UserRole.WAITER, UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
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
    async createOrder(@Body() orderToCreate: CreateOrderDto): Promise<Order> {
        return await this.orderService.createOrder(orderToCreate);
    }

    @Put("status/:id")
    // @Roles(UserRole.WAITER, UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
    @ApiOperation({
        summary: "Actualiza el estado de la orden",
        description: "Manejado solo por staff de restaurante, el status debe ser uno de los siguientes: " +
            "processing | cancelled | completed | paid"
    })
    @ApiParam({ name: "id", type: String, description: "ID de una orden" })
    @ApiBody({ schema: { example: { status: 'completed' } } })
    async updateStatus(@Param("id", ParseUUIDPipe) id: string, @Body() toUpdate: OrderStatusDto): Promise<Order> {
        return await this.orderService.updateStatus(id, toUpdate);
    }

    @Get(":id")
    // @Roles(UserRole.WAITER, UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
    @ApiParam({name: "id", type: String, description: "ID de la mesa"})
    async getOrderByTable(@Param("id", ParseUUIDPipe)id: string): Promise<OrderResponseDto> {
        return await this.orderService.getOrderByTable(id);
    }

    @Put("addDish/:id")
    // @Roles(UserRole.WAITER, UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
    @ApiOperation({
        summary: "Agrega un nuevo plato a una orden existente", description: "requiere el uuid de uno o mas platos?"
    })
    @ApiParam({ name: "id", type: String, description: "ID de una orden" })
    @ApiBody({ schema: { example: { id: 'uuid...' } } })
    async addDishToExisting(@Param("id", ParseUUIDPipe) id: string, @Body() toUpdate: Pick<CreateOrderDto, "ordered_dishes">): Promise<Order> {
        return await this.orderService.addDishToExisting(id, toUpdate);
    }

    // @Get(":id")
    // @Roles(UserRole.WAITER, UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
    // @ApiOperation({summary: "Una lista de las ordenes del restaurante", description: "Uuid del restaurante"})
    // @ApiParam({ name: "id", type: String, description: "ID del restaurante" })
    // async getRestaurantOrders(@Param("id", ParseUUIDPipe) id: string): Promise<Order[]> {
    //     return await this.orderService.getRestaurantOrders(id);
    // }

    @Delete(':id')
    // @Roles(UserRole.MANAGER)
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth()
    @ApiOperation({ summary: "Elimina el registro de una orden", description: "Manejado solo por manager de restaurante" })
    @ApiParam({ name: 'id', type: String, description: 'ID de una orden' })
    async deleteOrder(@Param('id', ParseUUIDPipe) id: string): Promise<HttpResponseDto> {
        return await this.orderService.deleteOrder(id);
    }

}
