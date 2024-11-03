import {  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Dish } from './dish.entity';

@Entity()
export class Menu_Category {
  @PrimaryGeneratedColumn('uuid')
  id: string 

  @Column({length:20,nullable:false})
  name: string;

  @ManyToOne(() => Menu, (menu) => menu.categories)
  menu: Menu;

  @OneToMany(() => Dish, (dish) => dish.category, { cascade: true, onDelete: "CASCADE" })
  dishes: Dish[];
  
}
