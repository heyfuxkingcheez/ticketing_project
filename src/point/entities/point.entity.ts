import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({
  name: 'point',
})
export class Point {
  @PrimaryGeneratedColumn({ type: 'int', name: 'pointId' })
  pointId: number;
  @Column({ type: 'int', name: 'UserId' })
  UserId: number;
  @Column({ type: 'int', name: 'balance', default: 1000000 })
  balance: number;
  @CreateDateColumn()
  createdAt: Timestamp;

  @OneToOne(() => User, (user) => user.userId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId' })
  user: User;
}
