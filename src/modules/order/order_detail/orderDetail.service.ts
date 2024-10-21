import { Injectable } from "@nestjs/common";
import { OrderedDishesDto } from "src/dtos/order/ordered_dishes.dto";
import { Dish } from "src/entities/dish.entity";
import { DishService } from "src/modules/dish/dish.service";
import { OrderDetailRepository } from "./orderDetail.repository";
import { OrderDetail } from "src/entities/orderDetail.entity";

@Injectable()
export class OrderDetailService {
    constructor(private readonly dishService: DishService, private readonly orderDetailRepository: OrderDetailRepository){}
    
    // async createOrderDetail(dishes: OrderedDishesDto[]): Promise<OrderDetail> {
    //     const dishesEntities: Dish[] = await this.dishService.get(dishes);
    //     const price: number = dishes.reduce((acumulador, dishPedido) => {
    //         const dishEntity = dishesEntities.find(dishEntity => dishEntity.id === dishPedido.id);
    //         acumulador =+ (dishEntity.price * dishPedido.quantity);
    //         return acumulador;
    //       }, 0);
    //     return this.orderDetailRepository.createOrderDetail(dishesEntities, price);
    // }
}