import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { Restaurant_Table } from "src/entities/tables.entity";
import { Order } from "src/entities/order.entity";
import { OrderDetailService } from "./order_detail/orderDetail.service";
import { OrderDetail } from "src/entities/orderDetail.entity";
import { UpdateOrderDto } from "src/dtos/order/update-order.dto";
import { TableService } from "../table/table.service";
import { HandleError } from "src/decorators/generic-error.decorator";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";

@Injectable()
export class OrderService {

    constructor(private readonly orderRepository: OrderRepository, private readonly tableService: TableService, private readonly orderDetailService: OrderDetailService) { }

    @HandleError(HttpMessagesEnum.ORDER_CREATION_FAILED, BadRequestException)
    async createOrder(orderToCreate: CreateOrderDto): Promise<Order> {
        const found_table: Restaurant_Table = await this.tableService.getTableById(orderToCreate.table);

        const new_order_detail: OrderDetail = await this.orderDetailService.createOrderDetail(orderToCreate.ordered_dishes);
        const new_order: Order = await this.orderRepository.createOrder(orderToCreate, found_table, new_order_detail);
        return new_order;

    }

    async getOrderById(id: string): Promise<Order> {
        const found_order: Order | undefined = await this.orderRepository.getOrderById(id);
        if (found_order === undefined) {

        }
        return found_order;
    }

    async updateOrder(id: string, dataToModify: UpdateOrderDto): Promise<Order> {
        try {
            const existingOrder: null | Order = await this.getOrderById(id);

            if (dataToModify.ordered_dishes) {
                const newOrderDetail: OrderDetail = await this.orderDetailService.updateOrderDetail(existingOrder.orderDetail, dataToModify.ordered_dishes);
                existingOrder.orderDetail = newOrderDetail;
            }

            const updatedOrder: Order = await this.orderRepository.updateOrder(existingOrder, dataToModify)
            return updatedOrder
        } catch (error) {
            throw new BadRequestException(`Error al actualizar la orden ${error.message}`)
        }
    }

    async deleteOrder(id: string): Promise<Order> {
        const existingOrder: null | Order = await this.getOrderById(id)
        if (!existingOrder) throw new BadRequestException('La order que se desea eliminar no existe')
        try {
            const deletedOrder = await this.orderRepository.deleteOrder(existingOrder);
            return deletedOrder
        } catch (error) {
            throw new BadRequestException(`Error al eliminar la orden ${error.message}`)
        }
    }
}