import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'reservation',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  reservationId: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Performance, (performance) => performance.reservations)
  @JoinColumn({ name: 'PerformanceId' })
  performance: Performance;

  @ManyToOne(() => Seat, (seat) => seat.seatId)
  @JoinColumn({ name: 'SeatId' })
  seat: Seat;

  @ManyToOne(() => Schedule, (schedule) => schedule.reservations)
  @JoinColumn({ name: 'ScheduleId' })
  schedule: Schedule;

  @Column()
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
