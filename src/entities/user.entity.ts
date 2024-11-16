import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Reservation } from './reservation.entity';
import { UserRole } from 'src/enums/roles.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { AccountType } from 'src/enums/account.type.enum';
// import { Review } from './review.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ unique: true, length: 50, nullable: false })
  email: string;

  @Column({
    default:
      'https://res.cloudinary.com/dvgvcleky/image/upload/f_auto,q_auto/v1/RestO/ffgx6ywlaix0mb3jghux',
  })
  profile_image: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({ length: 128, nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.NOTHING,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({ default: 'nothing', nullable: true })
  subscription: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONSUMER,
  })
  role: UserRole;

  /**
   * Asociación para meseros (un mesero solo puede estar en un restaurante)
   */
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.waiters, {
    nullable: true,
  })
  @JoinColumn({name: "waiter_in"})
  waiter_in: Restaurant;

  /**
   * Asociación para gerentes (un gerente UN SOLO restaurante)
   */
  @OneToOne(() => Restaurant, (restaurant) => restaurant.manager, { nullable: true })
  @JoinColumn({name: "owns_restaurant"})
  owns_restaurant: Restaurant[];

  @OneToMany(() => Reservation, (reservation) => reservation.user, { nullable: true })
  reservations: Reservation[];

  @Column({ nullable: false, default: false })
  was_deleted: boolean;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.LOCAL,
  })
  account_type: AccountType;

  @Column({ nullable: true })
  sub: string;

}
