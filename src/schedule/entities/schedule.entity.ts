import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entity';

@Entity({
  name: 'schedule',
})
export class Schedule {
  @PrimaryGeneratedColumn({ type: 'int', name: 'scheduleId' })
  scheduleId: number;

  @ManyToOne(() => Performance, (performance) => performance.schedules, {
    nullable: false,
  })
  @JoinColumn({ name: 'PerformanceId', referencedColumnName: 'performanceId' })
  performance: Performance;

  @Column({ type: 'time', name: 'start_time', nullable: false })
  startTime: Date;

  @Column({ type: 'time', name: 'end_time', nullable: false })
  endTime: Date;

  @Column({ type: 'int', name: 'standardLimit', nullable: false })
  standardLimit: number;

  @Column({ type: 'int', name: 'royalLimit', nullable: false })
  royalLimit: number;

  @Column({ type: 'int', name: 'vipLimit', nullable: false })
  vipLimit: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt: Timestamp;

  @OneToMany(() => Reservation, (reservation) => reservation.schedule)
  reservations: Reservation[];

  @OneToMany(() => Seat, (seat) => seat.schedules)
  seats: Seat[];
}
