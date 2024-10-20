import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Dish } from "./dish.entity";


@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @OneToOne(() => Order, (order) => order.orderDetail)
    @JoinColumn({name:'order_id'})
    order: Order;

    @ManyToMany(() => Dish, (dish) => dish.orderDetails)
    products: Dish[];

}