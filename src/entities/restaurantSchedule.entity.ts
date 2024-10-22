import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { DayOfWeek } from 'src/enums/dayOfWeek.enum';

@Entity()
export class RestaurantSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  isOpen: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.schedules, { nullable: false })
  restaurant: Restaurant;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek; // Enum para los días de la semana

  @Column('time', { nullable: true })
  openingTime: string | null // Hora de apertura

  @Column('time', { nullable: true })
  closingTime: string | null// Hora de cierre
}
