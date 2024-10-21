import {  Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Restaurant_Table } from './tables.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
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
    nullable: false,
  })
  table: Restaurant_Table;

 
}
