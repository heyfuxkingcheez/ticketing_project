import { Performance } from 'src/performance/entities/performance.entity';
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

  @ManyToOne(() => Performance, (performance) => performance.seat)
  @JoinColumn({ name: 'PerformanceId' })
  performance: Performance;

  @Column({ type: 'varchar', name: 'grade' })
  grade: string;

  @Column({ type: 'int', name: 'seatNum' })
  seatNum: number;

  @Column({ type: 'boolean', name: 'status', default: false })
  status: boolean;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;
}
