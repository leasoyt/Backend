import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
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
    // async updateDish(existingDish: Dish, dish_to_modify: UpdateDish): Promise<Dish> {
    //     const dishToUpdate: Dish = this.dishRepository.merge(existingDish, dish_to_modify)
    //     return this.dishRepository.save(dishToUpdate)
    // }
    // async deleteDish(dishToRemove: Dish) {
    //     return this.dishRepository.remove(dishToRemove)
    // }
    
}