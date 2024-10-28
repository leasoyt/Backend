import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "src/dtos/order/create-order.dto";
import { Restaurant_Table } from "src/entities/tables.entity";
import { Order } from "src/entities/order.entity";
import { OrderDetailService } from "./order_detail/orderDetail.service";
import { OrderDetail } from "src/entities/orderDetail.entity";
import { TableService } from "../table/table.service";
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { HttpResponseDto } from "src/dtos/http-response.dto";
import { OrderStatusDto } from "src/dtos/order/order-status.dto";
import { RestaurantService } from "../restaurant/restaurant.service";
import { OrderResponseDto } from "src/dtos/order/order-response.dto";

@Injectable()
export class OrderService {

    constructor(
        private readonly orderRepository: OrderRepository, 
        private readonly tableService: TableService, 
        private readonly orderDetailService: OrderDetailService,
        private readonly restaurantService: RestaurantService
    ) { }

    @TryCatchWrapper(HttpMessagesEnum.ORDER_CREATION_FAILED, InternalServerErrorException)
    async createOrder(orderToCreate: CreateOrderDto): Promise<Order> {
        const found_table: Restaurant_Table = await this.tableService.getRawTableById(orderToCreate.table);

        const new_order_detail: OrderDetail = await this.orderDetailService.createOrderDetail(orderToCreate.ordered_dishes);
        const new_order: Order = await this.orderRepository.createOrder(orderToCreate, found_table, new_order_detail);
        return new_order;

    }

    async getOrderById(id: string): Promise<Order> {
        const found_order: Order | undefined = await this.orderRepository.getOrderById(id);
        if (found_order === undefined) {
            throw { error: HttpMessagesEnum.ORDER_NOT_FOUND, exception: NotFoundException }
        }
        return found_order;
    }

    // @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    // async getRestaurantOrders(id: string): Promise<Order[]> {
    //     const found_restaurant: Restaurant = await this.restaurantService.getRestaurantById(id);
    //     const found_orders: Order[] = await this.restaurantService.getRestaurantOrders(found_restaurant);
    //     return found_orders;
    // }

    @TryCatchWrapper(HttpMessagesEnum.ORDER_UPDATE_FAILED, BadRequestException)
    async updateStatus(id: string, update: OrderStatusDto): Promise<Order> {
        const to_modify: Order = await this.getOrderById(id);

        if (update.status === to_modify.status) {
            throw { error: HttpMessagesEnum.ORDER_STATUS_CONFLICT, exception: ConflictException }
        }

        return await this.orderRepository.updateOrder(to_modify, { status: update.status });
    }

    @TryCatchWrapper(HttpMessagesEnum.ORDER_UPDATE_FAILED, BadRequestException)
    async addDishToExisting(id: string, order: Pick<CreateOrderDto, "ordered_dishes">): Promise<Order> {
        const { orderDetail } = await this.getOrderById(id);
        await this.orderDetailService.addDishToExistingDetail(orderDetail, order.ordered_dishes);
        return await this.getOrderById(id);
    }

    @TryCatchWrapper(HttpMessagesEnum.ORDER_DELETION_FAILED, InternalServerErrorException)
    async deleteOrder(id: string): Promise<HttpResponseDto> {
        const existingOrder: Order = await this.getOrderById(id);
        await this.orderRepository.deleteOrder(existingOrder);
        return { message: HttpMessagesEnum.ORDER_DELETION_SUCCESS };
    }

    @TryCatchWrapper(HttpMessagesEnum.NO_ORDERS_IN_TABLE, NotFoundException)
    async getOrderByTable(id: string): Promise<OrderResponseDto> {
        const found_table: Restaurant_Table = await this.tableService.getRawTableById(id);
        const found_order: Order | undefined = await this.orderRepository.getOrderByTable(found_table);

        if (found_order === undefined) {
            throw {};
        }

        return {...found_order, table_id: found_table.number };
    }
}