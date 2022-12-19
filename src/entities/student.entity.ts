import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Parent } from './parent.entity';
import { Subscription } from './subscription.entity';
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

  @OneToOne(() => User)
  user?: User;

  @OneToOne(() => Subscription)
  subscription?: Subscription;

  @ManyToOne(() => Parent, (Parent) => Parent.students)
  @JoinColumn()
  parent?: Parent;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
