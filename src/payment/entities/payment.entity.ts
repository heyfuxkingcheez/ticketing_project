import { Ticket } from 'src/ticket/entities/ticket.entity';
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
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'payment',
})
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'paymentId' })
  paymentId: number;

  @Column({ type: 'int', name: 'UserId' })
  UserId: number;

  @Column({ type: 'boolean', name: 'status' })
  status: boolean;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @OneToMany(() => Ticket, (ticket) => ticket.PaymentId)
  ticket: Ticket[];
}
