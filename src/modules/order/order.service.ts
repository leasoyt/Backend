import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { TableRepository } from "./PruebaTable.repository";
import { Restaurant_Table } from "src/entities/tables.entity";
import { Order } from "src/entities/order.entity";
import { OrderDetailService } from "./order_detail/orderDetail.service";
import { OrderDetail } from "src/entities/orderDetail.entity";

@Injectable()
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository, private readonly tableRepository: TableRepository, private readonly orderDetailService: OrderDetailService){}
    async createOrder(orderToCreate: CreateOrderDto) {
        const foundedTable: null | Restaurant_Table = await this.tableRepository.getTableById(orderToCreate.table);
        if (!foundedTable) throw new BadRequestException('La mesa a la que desea agregar esta orden no existe')
        try {
            // const newOrderDetail: OrderDetail = await this.orderDetailService.createOrderDetail(orderToCreate.ordered_dishes);
            // const newOrder: Order = await this.orderRepository.createOrder(orderToCreate, foundedTable, newOrderDetail);
            


            // const foundedMenu: null | Menu = await this.menuRepository.getMenuById(dishToCreate.menu)
            // if (!foundedMenu) throw new BadRequestException('El menu al que se quiere agregar este platillo no existe')
            // const createdDish: Dish = await this.dishRepository.createDish(dishToCreate, foundedMenu);
            // const {menu, orderDetails, ...dishToReturn} = createdDish;
            // return dishToReturn;
        } catch (error) {
            throw new BadRequestException(`Error al crear el platillo ${error.message}`)
        }
        
    }
    // async updateDish(id: string, modified_dish: UpdateDish): Promise<Dish> {
    //     const existingDish: null | Dish = await this.getDishById(id);
    //     if (!existingDish) throw new BadRequestException('El plato que se desea actualizar no existe')
    //     try {
    //         const updatedDish: Dish = await this.dishRepository.updateDish(existingDish, modified_dish)
    //         return updatedDish
    //     } catch (error) {
    //         throw new BadRequestException(`Error al actualizar el platillo ${error.message}`)
    //     }
    // }
    // async deleteDish(id: string) {
    //     const existingDish: null | Dish = await this.getDishById(id)
    //     if (!existingDish) throw new BadRequestException('El plato que se desea eliminar no existe')
    //     try {
    //         const deletedDish = await this.dishRepository.deleteDish(existingDish)
    //         return deletedDish
    //     } catch (error) {
    //         throw new BadRequestException(`Error al eliminar el platillo ${error.message}`)
    //     }
    // }
}