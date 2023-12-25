import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'performance',
})
export class Performance {
  @PrimaryGeneratedColumn()
  performanceId: number;

  @Column({ type: 'varchar', nullable: false })
  performanceTitle: string;

  @Column({ type: 'timestamp', nullable: false })
  startTime: Timestamp;

  @Column({ type: 'timestamp', nullable: false })
  endTime: Timestamp;

  @Column({ type: 'int', nullable: false })
  age: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;
}
