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

@Entity({
  name: 'schedule',
})
export class Schedule {
  @PrimaryGeneratedColumn()
  scheduleId: number;

  @ManyToOne(() => Performance, (performance) => performance.schedules, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'PerformanceId', referencedColumnName: 'performanceId' })
  performance: Performance;

  @Column({ type: 'time', name: 'start_time', nullable: false })
  startTime: Date;

  @Column({ type: 'time', name: 'end_time', nullable: false })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt: Timestamp;

  @OneToMany(() => Reservation, (reservation) => reservation.schedule)
  reservations: Reservation[];
}
