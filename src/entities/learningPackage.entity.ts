import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Student } from './student.entity';
import { Subject } from './subject.entity';
import { Subscription } from './subscription.entity';

@Entity('learning-packages')
export class LearningPackage {
  constructor(data?: LearningPackage) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  name?: string;

  @Column({ type: 'varchar' })
  type?: string;

  @ManyToOne(
    () => Subscription,
    (Subscription) => Subscription.learningPackages,
  )
  subscription?: Subscription;

  @OneToMany(() => Subject, (Subject) => Subject.learningPackage)
  subjects?: Subject[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
