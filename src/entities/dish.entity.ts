import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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
  @JoinTable({
    name: 'dish_order_detail',
    joinColumn: {
      name: 'dish_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'order_detail_id',
      referencedColumnName: 'id',
    },
  })
  orderDetails: OrderDetail[];
}


