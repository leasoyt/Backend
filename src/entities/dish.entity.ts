import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Menu } from './menu.entity';
import { OrderDetail } from './orderDetail.entity';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  stock: boolean

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'default-image-url.jpg' })
  imgUrl: string;

  @ManyToOne(() => Menu, (menu) => menu.dishes, { nullable: false })
  menu: Menu;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetail[];
}


