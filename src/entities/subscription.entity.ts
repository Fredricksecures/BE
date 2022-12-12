import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { LearningPackage } from './learningPackage.entity';
import { Student } from './student.entity';

@Entity('subscription')
export class Subscription {
  constructor(data?: Subscription) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  price?: string;

  @OneToMany(
    () => LearningPackage,
    (LearningPackage) => LearningPackage.subscription,
  )
  learningPackages?: LearningPackage[];

  @OneToOne(() => Student)
  student?: Student;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
