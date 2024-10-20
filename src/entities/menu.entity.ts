import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Dish } from './dish.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: "menu" })
  name: string;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.menu, { nullable: false })
  restaurant: Restaurant;

  @OneToMany(() => Dish, (dish) => dish.menu, { cascade: true, onDelete: "CASCADE" })
  dishes: Dish[];
}
