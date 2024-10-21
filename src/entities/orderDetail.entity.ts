import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Dish } from "./dish.entity";


@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @OneToOne(() => Order, (order) => order.orderDetail, { onDelete: 'CASCADE' })
    @JoinColumn({name:'order_id'})
    order: Order;

    @ManyToMany(() => Dish, (dish) => dish.orderDetails, { onDelete: 'CASCADE' })
    @JoinTable({
        name: 'dish_order_detail',
        joinColumn: {
          name: 'order_detail_id', // Ahora OrderDetail es el dueño de la relación
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'dish_id', // Dish es la entidad relacionada
          referencedColumnName: 'id',
        },
      })
    products: Dish[];

}