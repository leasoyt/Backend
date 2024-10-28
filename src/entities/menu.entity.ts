import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Menu_Category } from './menu_category.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'menu' })
  name: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu, {
    nullable: true,
  })
  restaurant: Restaurant; // Esto creará el restaurant_id en la tabla menu

  @OneToMany(() => Menu_Category, (cat) => cat.menu, {
    nullable: true,
    cascade: true,
  })
  categories: Menu_Category[];
}
