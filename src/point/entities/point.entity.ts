import { Reservation } from 'src/reservation/entities/reservation.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'point',
})
export class Point {
  @PrimaryGeneratedColumn({ type: 'int', name: 'pointId' })
  pointId: number;

  @Column({ type: 'int', name: 'UserId', nullable: false })
  UserId: number;

  @ManyToOne(() => User, (user) => user.userId, {
    // onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => Reservation, (reservation) => reservation.point)
  @JoinColumn({ name: 'ReservationId' })
  reservation: Reservation;

  @Column({ type: 'int', default: 1000000, nullable: false })
  income: number;

  @Column({ type: 'int', default: 0, nullable: false })
  expense: number;

  @Column({ type: 'int', name: 'balance', default: 1000000, nullable: false })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;
}
