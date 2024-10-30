import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { OrderDetail } from './orderDetail.entity';
import { Menu_Category } from './menu_category.entity';
import Decimal from 'decimal.js';

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

  @Column({
    type: "decimal", precision: 10, scale: 2, nullable: false, transformer: {
      to: (value: Decimal) => value.toNumber(),
      from: (value: string) => value ? new Decimal(value) : null
    }
  })
  price: Decimal;

  @Column({ default: 'default-image-url.jpg' })
  imgUrl: string;

  @ManyToOne(() => Menu_Category, (cat) => cat.dishes, { onDelete: "CASCADE" })
  category: Menu_Category;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetail[];
}


