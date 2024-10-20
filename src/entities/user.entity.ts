import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Reservation } from './reservation.entity';
import { UserRole } from 'src/enums/roles.enum';
// import { Review } from './review.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ unique: true, length: 50, nullable: false })
  email: string;

  @Column({ default: 'default-image-url.jpg' })
  profile_image: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({ length: 128, nullable: false })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONSUMER,
  })
  role: UserRole;

  /**
   * Asociación para meseros (un mesero solo puede estar en un restaurante)
   */
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.waiters, { nullable: true })
  waiterRestaurant: Restaurant;

  /**
   * Asociación para gerentes (un gerente puede estar en varios restaurantes)
   */
  @OneToMany(() => Restaurant, (restaurant) => restaurant.manager, { nullable: true })
  managedRestaurants: Restaurant[];

  @OneToMany(() => Reservation, (reservation) => reservation.user, { nullable: true })
  reservations: Reservation[];

  // @OneToMany(() => Review, (review) => review.user, { nullable: true, onDelete: 'CASCADE' })
  // reviews: Review[];
}
