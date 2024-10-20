import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetail } from './orderDetail.entity';
import { Restaurant_Table } from './tables.entity';
import { orderStatus } from 'src/enums/orderStatus.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: Date;

  @Column({
    type: 'enum',
    enum: orderStatus,
    default: orderStatus.PROCESSING,
  })
  status: orderStatus;

  @OneToOne(() => Restaurant_Table, (table) => table.order, { nullable: true }) // Puede ser nullable si no siempre hay una mesa
  table: Restaurant_Table;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail;
}
