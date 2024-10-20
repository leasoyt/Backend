import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { OrderController } from "./order.controller";
import { Restaurant_Table } from "src/entities/tables.entity";
import { TableRepository } from "./PruebaTable.repository";
import { DishModule } from "../dish/dish.module";
import { OrderDetailService } from "./order_detail/orderDetail.service";
import { OrderDetailRepository } from "./order_detail/orderDetail.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Order, Restaurant_Table]), DishModule],
    providers: [OrderService, OrderRepository, TableRepository, OrderDetailService, OrderDetailRepository],
    controllers: [OrderController]
})
export class OrderModule {}