import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Menu_Category } from './menu_category.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: "menu" })
  name: string;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.menu, { nullable: false })
  restaurant: Restaurant;

  @OneToMany(() => Menu_Category, (cat) => cat.menu,{ nullable: true, cascade: true })
  categories: Menu_Category[]


  
}
