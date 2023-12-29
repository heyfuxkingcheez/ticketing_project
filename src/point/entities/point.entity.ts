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

  @Column({ type: 'int', name: 'UserId' })
  UserId: number;

  @ManyToOne(() => User, (user) => user.userId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column()
  income: number;

  @Column()
  expense: number;

  @Column({ type: 'int', name: 'balance', default: 1000000 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;
}
