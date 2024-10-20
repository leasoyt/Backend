import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Dish } from "src/entities/dish.entity"
import { Order } from "src/entities/order.entity"
import { OrderDetail } from "src/entities/orderDetail.entity"
import { Repository } from "typeorm"

@Injectable()
export class OrderDetailRepository{
    constructor(@InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>){}
    async createOrderDetail(products: Dish[], price: number): Promise<OrderDetail> {
        const createdOrderDetail : OrderDetail = this.orderDetailRepository.create({price, products})
        return this.orderDetailRepository.save(createdOrderDetail)
    }
    async deleteOrderDetail(orderDetailToRemove: OrderDetail): Promise<OrderDetail> {
        return this.orderDetailRepository.remove(orderDetailToRemove)
    }
}