import { Injectable } from "@nestjs/common";
import { OrderedDishesDto } from "src/dtos/order/ordered_dishes.dto";
import { Dish } from "src/entities/dish.entity";
import { DishService } from "src/modules/dish/dish.service";
import { OrderDetailRepository } from "./orderDetail.repository";
import { OrderDetail } from "src/entities/orderDetail.entity";
import Decimal from "decimal.js";

@Injectable()
export class OrderDetailService {

    constructor(private readonly dishService: DishService, private readonly orderDetailRepository: OrderDetailRepository) { }

    async createOrderDetail(dishes: OrderedDishesDto[]): Promise<OrderDetail> {

        const found_dishes: Dish[] = await this.dishService.getManyDishesById(dishes);
        let price: Decimal = new Decimal(0);

        dishes.forEach((dish) => {
            const dish_instance: Dish = found_dishes.find(x => x.id === dish.id);
            price = price.plus(dish_instance.price.mul(dish.quantity));
        });

        const newOrderDetail: OrderDetail = await this.orderDetailRepository.createOrderDetail(found_dishes, price);

        return newOrderDetail;
    }

    // async updateOrderDetail(currentOrderDetail: OrderDetail, dishes: OrderedDishesDto[]) {
    //     try {
    //         const newOrderDetail: OrderDetail = await this.createOrderDetail(dishes);
    //         await this.orderDetailRepository.deleteOrderDetail(currentOrderDetail);
    //         return newOrderDetail;
    //     } catch (err) {
    //         throw { error: err?.error || err || "Failed to update order detail" };
    //     }
    // }

    async addDishToExistingDetail(currentOrderDetail: OrderDetail, dishes: OrderedDishesDto[]): Promise<OrderDetail> {

        const found_dishes: Dish[] = await this.dishService.getManyDishesById(dishes);
        let price: Decimal = new Decimal(0);
        let actualized_dishes: Dish[];
        return new OrderDetail();
        dishes.forEach((dish) => {
            const dish_instance: undefined | Dish = found_dishes.find(x => x.id === dish.id);

            if (dish_instance === undefined) {
                price = price.plus(dish_instance.price.mul(dish.quantity));
                
            }
        });
    }
}