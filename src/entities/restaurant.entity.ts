import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, BeforeInsert, Unique } from 'typeorm';
import { User } from './user.entity';
import { Restaurant_Table } from './tables.entity';
import { Menu } from './menu.entity';
import { RestaurantSchedule } from './restaurantSchedule.entity';
import { Reservation } from './reservation.entity';

@Entity()
@Unique(["manager"])
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
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
  @OneToMany(() => User, (user) => user.waiter_in, { nullable: true })
  waiters: User[];

  @OneToOne(() => User, (user) => user.owns_restaurant, { nullable: true })
  @JoinColumn({name: "manager"})
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

  @Column({ nullable: false, default: false })
  was_deleted: boolean;
}
