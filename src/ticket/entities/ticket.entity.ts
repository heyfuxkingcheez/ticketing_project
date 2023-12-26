import { Payment } from 'src/payment/entities/payment.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { Seat } from 'src/seat/entities/seat.entity';
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
  name: 'ticket',
})
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ticketId' })
  ticketId: number;

  @Column({ type: 'int', name: 'PaymentId' })
  PaymentId: number;

  @Column({ type: 'int', name: 'SeatId' })
  SeatId: number;

  @Column({ type: 'int', name: 'PerformanceId' })
  PerformanceId: number;

  @Column({ type: 'int', name: 'ticketPrice' })
  ticketPrice: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;

  @ManyToOne(() => Performance, (performance) => performance.performanceId)
  @JoinColumn({ name: 'PerformanceId' })
  performance: Performance;

  @ManyToOne(() => Payment, (payment) => payment.paymentId)
  @JoinColumn({ name: 'PaymentId' })
  payment: Payment;

  @OneToMany(() => Seat, (seat) => seat.TicketId)
  seat: Seat[];
}
