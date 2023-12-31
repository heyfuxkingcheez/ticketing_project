import { Performance } from 'src/performance/entities/performance.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
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
  })
  @JoinColumn({ name: 'PerformanceId' })
  performance: Performance;

  @ManyToOne(() => User, (user) => user.seat, { nullable: false })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Reservation, (reservation) => reservation.seat, {
    nullable: false,
  })
  @JoinColumn({ name: 'ReservationId' })
  reservation: Reservation;

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
