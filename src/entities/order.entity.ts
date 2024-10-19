import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderDetail } from './orderDetail.entity';
import { Restaurant_Table } from './tables.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('date')
  date: Date;

  @OneToOne(() => Restaurant_Table, (table) => table.order, { nullable: true }) // Puede ser nullable si no siempre hay una mesa
  table: Restaurant_Table;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail;
}
