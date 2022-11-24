import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Parent } from './parent.entity';
import { User } from './user.entity';

@Entity('students')
export class Student {
  constructor(data?: Student) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  firstName?: string;

  @Column({ type: 'varchar' })
  lastName?: string;

  @Column({ type: 'varchar' })
  dateOfBirth?: string;

  @OneToOne(() => User)
  user?: User;

  @ManyToOne(() => Parent, (Parent) => Parent.students)
  parent?: Parent;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
