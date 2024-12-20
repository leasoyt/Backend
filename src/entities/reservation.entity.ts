import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Restaurant_Table } from './tables.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { Restaurant } from './restaurant.entity';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: "timestamp"})
  date: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @ManyToOne(() => User, (user) => user.reservations, { nullable: false })
  @JoinColumn({ name: "user" })
  user: User;

  @ManyToOne(() => Restaurant_Table, (table) => table.reservations, {
    nullable: true,
  })
  @JoinColumn()
  table: Restaurant_Table;

  @Column()
  seats: number;

  @ManyToOne(() => Restaurant, (resta) => resta.id, { nullable: false })
  restaurant: Restaurant;
}
