import {  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Menu } from './menu.entity';
import { Dish } from './dish.entity';


@Entity()
export class Menu_Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({length:20,nullable:false})
  name: string;

  @ManyToOne(() => Menu, (menu) => menu.categories)
  menu: Menu;

  @OneToMany(() => Dish, (dish) => dish.category, { cascade: true })
  dishes: Dish[];

  
}
