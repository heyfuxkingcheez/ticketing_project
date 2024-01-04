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
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Point } from 'src/point/entities/point.entity';

@Entity({
  name: 'reservation',
})
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'reservationId' })
  reservationId: number;

  @ManyToOne(() => User, (user) => user.userId, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Performance, (performance) => performance.reservations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PerformanceId' })
  performance: Performance;

  @OneToMany(() => Seat, (seat) => seat.reservation)
  seat: Seat[];

  @OneToMany(() => Point, (point) => point.reservation)
  point: Point[];

  @ManyToOne(() => Schedule, (schedule) => schedule.reservations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ScheduleId' })
  schedule: Schedule;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
