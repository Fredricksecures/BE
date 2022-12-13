import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { LearningPackage } from './learningPackage.entity';
import { Lesson } from './lesson.entity';

@Entity('subjects')
export class Subject {
  constructor(data?: Subject) {
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

  @ManyToOne(
    () => LearningPackage,
    (LearningPackage) => LearningPackage.subjects,
  )
  learningPackage?: LearningPackage;

  @OneToMany(() => Lesson, (Lesson) => Lesson.subject)
  lessons?: Lesson[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
