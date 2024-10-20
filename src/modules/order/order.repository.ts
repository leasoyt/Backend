import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { UpdateOrderDto } from "src/dtos/order/update-order.dto";
import { Order } from "src/entities/order.entity";
import { OrderDetail } from "src/entities/orderDetail.entity";
import { Restaurant_Table } from "src/entities/tables.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderRepository{
    
    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>){}
    async createOrder(orderToCreate: CreateOrderDto, table: Restaurant_Table, orderDetail: OrderDetail): Promise<Order> {
        const createdOrder : Order = this.orderRepository.create({...orderToCreate, table, date: new Date, orderDetail}) 
        return this.orderRepository.save(createdOrder)
    }
    async getOrderById(id: string): Promise<Order | null>{
        const foundedOrder: null | Order = await this.orderRepository.findOneBy({id})
        return foundedOrder;
    }
    async updateOrder(existingOrder: Order, orderTomodify: UpdateOrderDto): Promise<Order> {
        const dishToUpdate: Order = this.orderRepository.merge(existingOrder, orderTomodify)
        return this.orderRepository.save(dishToUpdate)
    }
    async deleteOrder(existingOrder: Order): Promise<Order> {
        return this.orderRepository.remove(existingOrder)
    }
    
}