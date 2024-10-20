import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { OrderDetail } from './orderDetail.entity';
import { Menu_Category } from './menu_category.entity';

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

  @ManyToOne(() => Menu_Category, (cat) => cat.dishes)
  category: Menu_Category;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetail[];
}


