import { Performance } from 'src/performance/entities/performance.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  UsingJoinColumnIsNotAllowedError,
} from 'typeorm';

@Entity({
  name: 'place',
})
export class Place {
  @PrimaryGeneratedColumn({ type: 'int', name: 'placeId' })
  placeId: number;

  @Column({ type: 'int', name: 'PerformanceId' })
  PerformanceId: number;

  @Column({ type: 'varchar', name: 'place' })
  place: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;

  @OneToMany(() => Seat, (seat) => seat.PlaceId)
  seat: Seat[];

  @ManyToOne(() => Performance, (performance) => performance.performanceId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PerformanceId' })
  performance: Performance;

  @OneToMany(() => Ticket, (ticket) => ticket.PlaceId)
  ticket: Ticket[];
}
