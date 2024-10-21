import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { TableRepository } from "./PruebaTable.repository";
import { Restaurant_Table } from "src/entities/tables.entity";
import { Order } from "src/entities/order.entity";
import { OrderDetailService } from "./order_detail/orderDetail.service";
import { OrderDetail } from "src/entities/orderDetail.entity";
import { UpdateOrderDto } from "src/dtos/order/update-order.dto";

@Injectable()
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository, private readonly tableRepository: TableRepository, private readonly orderDetailService: OrderDetailService){}
    async createOrder(orderToCreate: CreateOrderDto): Promise<Order> {
        const foundedTable: null | Restaurant_Table = await this.tableRepository.getTableById(orderToCreate.table);
        if (!foundedTable) throw new BadRequestException('La mesa a la que desea agregar esta orden no existe')
        try {
            const newOrderDetail: OrderDetail = await this.orderDetailService.createOrderDetail(orderToCreate.ordered_dishes);
            const newOrder: Order = await this.orderRepository.createOrder(orderToCreate, foundedTable, newOrderDetail);
            return newOrder;
        } catch (error) {
            throw new BadRequestException(`Error al crear la orden ${error.message}`)
        }
        
    }
    async getOrderById (id: string): Promise<Order> {
        return this.orderRepository.getOrderById(id);
    }
    async updateOrder(id: string, dataToModify: UpdateOrderDto): Promise<Order> {
        const existingOrder: null | Order = await this.getOrderById(id);
        if (!existingOrder) throw new BadRequestException('La orden que se desea actualizar no existe')
        if(dataToModify.ordered_dishes){
            const newOrderDetail: OrderDetail = await this.orderDetailService.updateOrderDetail(existingOrder.orderDetail, dataToModify.ordered_dishes);
            existingOrder.orderDetail = newOrderDetail;        
        }
        try {
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