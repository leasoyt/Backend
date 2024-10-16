import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Restaurant } from './restaurant.entity';
import { Dish } from './dish.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.menu)
  restaurant: Restaurant;

  // Relación con los platos
  @OneToMany(() => Dish, (dish) => dish.menu, { cascade: true })
  dishes: Dish[];
}
