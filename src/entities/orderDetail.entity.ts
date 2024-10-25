import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Dish } from "./dish.entity";
import Decimal from "decimal.js";


@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
      type: "decimal", precision: 10, scale: 2, transformer: {
        to: (value: Decimal) => value.toNumber(),
        from: (value: string) => new Decimal(value),
      }
    })
    price: Decimal;

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