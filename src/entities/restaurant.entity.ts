import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { User } from './user.entity';
import { Restaurant_Table } from './tables.entity';
import { Menu } from './menu.entity';
import { RestaurantSchedule } from './restaurantSchedule.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  name: string;

  @Column()
  address: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    default:
      'https://res.cloudinary.com/dvgvcleky/image/upload/v1729701300/RestO/c4pyhwljetkgahtkwkpi.webp',
  })
  imgUrl: string;

  @Column({ nullable: true })
  rating: number;

  @OneToOne(() => Menu, (menu) => menu.restaurant, {
    cascade: true,
    nullable: false, //NUNCA PUEDE SER NULLABLE
    onDelete: "CASCADE" //ELIMINA AL MENU SI ESTA SE BORRA
  })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @OneToMany(() => Restaurant_Table, (table) => table.restaurant, {
    cascade: true, 
    nullable: true
  })
  tables: Restaurant_Table[];

  // Asociación inversa para meseros
  @OneToMany(() => User, (user) => user.waiterRestaurant, { nullable: true })
  waiters: User[];

  // Asociación inversa para el gerente (solo un gerente por restaurante)
  @ManyToOne(() => User, (user) => user.managedRestaurants, { nullable: false })
  manager: User;

  @OneToMany(() => RestaurantSchedule, (schedule) => schedule.restaurant, {
    cascade: true, 
    nullable: true
  })
  schedules: RestaurantSchedule[];

  @OneToMany(() => Reservation, (reserv) => reserv.restaurant, {
    cascade: true, 
    nullable: true
  })
  reservations: Reservation[];

  @BeforeInsert()
  async createSecondaryEntity() {
    if (!this.menu) {
      this.menu = new Menu();
    }
  }
}
