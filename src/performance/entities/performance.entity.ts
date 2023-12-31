import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Category } from 'src/user/types/performance.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'performance',
})
export class Performance {
  @PrimaryGeneratedColumn({ type: 'int', name: 'performanceId' })
  performanceId: number;

  @Column({ type: 'varchar', name: 'performanceTitle', nullable: false })
  performanceTitle: string;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column({ type: 'int', nullable: false })
  age: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  imageUrl: string;

  @Column({ type: 'int', nullable: false })
  hours: number;

  @Column({ type: 'varchar', nullable: false })
  place: string;

  @Column({ type: 'varchar', nullable: false })
  startDate: string;

  @Column({ type: 'varchar', nullable: false })
  endDate: string;

  @Column({ type: 'int', nullable: false })
  standardLimit: number;

  @Column({ type: 'int', nullable: false })
  royalLimit: number;

  @Column({ type: 'int', nullable: false })
  vipLimit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.performance)
  schedules: Schedule[];

  @OneToMany(() => Reservation, (reservation) => reservation.performance)
  reservations: Reservation[];

  @OneToMany(() => Seat, (seat) => seat.performance)
  seat: Seat[];
}
