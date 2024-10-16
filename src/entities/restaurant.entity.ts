import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Restaurant_Table } from './tables.entity';
import { Menu } from './menu.entity';
import { v4 as uuidv4 } from 'uuid';
import { RestaurantSchedule } from './restaurantSchedule.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 'default-image-url.jpg' })
  imgUrl: string;

  @OneToOne(() => Menu, (menu) => menu.restaurant, { cascade: true })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @OneToMany(() => Restaurant_Table, (table) => table.restaurant)
  tables: Restaurant_Table[];

  // Asociación inversa para meseros
  @OneToMany(() => User, (user) => user.waiterRestaurant)
  waiters: User[];

  // Asociación inversa para el gerente (solo un gerente por restaurante)
  @ManyToOne(() => User, (user) => user.managedRestaurants, { nullable: false })
  manager: User;

  @OneToMany(() => RestaurantSchedule, (schedule) => schedule.restaurant, {
    cascade: true,
  })
  schedules: RestaurantSchedule[];
}
