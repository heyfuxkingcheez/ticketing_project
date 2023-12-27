import { Place } from 'src/place/entities/place.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
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

  @Column({ type: 'int', name: 'PlaceId' })
  PlaceId: number;

  @Column({ type: 'varchar', name: 'grade' })
  grade: string;

  @Column({ type: 'int', name: 'seatNum' })
  seatNum: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;

  @ManyToOne(() => Place, (place) => place.placeId)
  @JoinColumn({ name: 'PlaceId' })
  place: Place;
}
