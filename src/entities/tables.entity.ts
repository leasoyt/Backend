import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Reservation } from './reservation.entity';
import { TableStatus } from 'src/enums/tableStatus.enum';
import { Order } from './order.entity';

@Entity({ name: 'restaurant_tables' })
export class Restaurant_Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number; 

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  // Asociación con el restaurante al que pertenece
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, {
    nullable: false,
  })
  restaurant: Restaurant;

  // Relación con las reservas asociadas a esta mesa
  @OneToMany(() => Reservation, (reservation) => reservation.table, {nullable: true})
  reservations: Reservation[];

  @OneToOne(() => Order, (order) => order.table, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'order_id'})
  order: Order;
}
