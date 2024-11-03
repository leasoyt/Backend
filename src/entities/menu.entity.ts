import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Menu_Category } from './menu_category.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'menu' })
  name: string;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.menu, {
    nullable: true, 
    // onDelete: "CASCADE"
  })
  restaurant: Restaurant;

  @OneToMany(() => Menu_Category, (cat) => cat.menu, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  categories: Menu_Category[];
}
