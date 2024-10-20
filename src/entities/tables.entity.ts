import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
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
  number: number; // Número o identificación de la mesa

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
  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations: Reservation[];


  @OneToOne(() => Order, (order) => order.table)
  order: Order;
}
