import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Order } from "./order.entity";
import { Dish } from "./dish.entity";


@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @OneToOne(() => Order, (order) => order.orderDetail)
    @JoinColumn({name:'order_id'})
    order: Order;

    @ManyToMany(() => Dish, (dish) => dish.orderDetails)
    products: Dish[];

}