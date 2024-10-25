import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import Decimal from "decimal.js"
import { Dish } from "src/entities/dish.entity"
import { OrderDetail } from "src/entities/orderDetail.entity"
import { Repository } from "typeorm"

@Injectable()
export class OrderDetailRepository{

    constructor(@InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>){}

    async createOrderDetail(products: Dish[], price: Decimal): Promise<OrderDetail> {
        const created_order_detail : OrderDetail = this.orderDetailRepository.create({price: price, products: products})
        return this.orderDetailRepository.save(created_order_detail)
    }

    async addDishToExistingDetail(): Promise<OrderDetail> {
        // const actualized_order_detail: OrderDetail = this.orderDetailRepository.merge();
        return new OrderDetail();
    }

    async deleteOrderDetail(orderDetailToRemove: OrderDetail): Promise<OrderDetail> {
        return this.orderDetailRepository.remove(orderDetailToRemove)
    }
}