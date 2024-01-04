import { Performance } from 'src/performance/entities/performance.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Grade } from 'src/user/types/grade.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'seat',
})
export class Seat {
  @PrimaryGeneratedColumn({ type: 'int', name: 'seatId' })
  seatId: number;

  @ManyToOne(() => Performance, (performance) => performance.seat, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PerformanceId' })
  performance: Performance;

  @ManyToOne(() => User, (user) => user.seat, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Reservation, (reservation) => reservation.seat, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ReservationId' })
  reservation: Reservation;

  @ManyToOne(() => Schedule, (schedule) => schedule.seats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ScheduleId', referencedColumnName: 'scheduleId' })
  schedules: Schedule;

  @Column({ type: 'enum', enum: Grade })
  grade: Grade;

  @Column({ type: 'int', name: 'seatNum', nullable: false })
  seatNum: number;

  @Column({ type: 'int', name: 'seatPrice', nullable: false })
  seatPrice: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;
}
