import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Parent } from './parent.entity';

@Entity('users')
export class User {
  constructor(data?: User) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  type?: string;

  @OneToOne(() => Parent)
  @JoinColumn()
  parent?: Parent;

  @OneToOne(() => Student)
  @JoinColumn()
  student?: Student;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
