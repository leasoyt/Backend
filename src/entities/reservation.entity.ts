import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Restaurant_Table } from './tables.entity';
import { ReservationStatus } from 'src/enums/reservationStatus.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column('date')
  date: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @ManyToOne(() => User, (user) => user.reservations, { nullable: false })
  user: User;

  @ManyToOne(() => Restaurant_Table, (table) => table.reservations, {
    nullable: false,
  })
  table: Restaurant_Table;

  @BeforeInsert()
  generateUuid() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
