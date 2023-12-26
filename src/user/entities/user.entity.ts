import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../types/userRole.type';
import { Point } from '../../point/entities/point.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({ name: 'userId' })
  userId: number;
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;
  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;
  @Column({ type: 'varchar', nullable: false })
  name: string;
  @Column({ type: 'varchar', nullable: false })
  sex: string;
  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Timestamp;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
}
