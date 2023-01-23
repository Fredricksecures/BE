import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Chapter } from './chapter.entity';
import { LearningPackage } from '../../utility/entity/learningPackage.entity';
import { Lesson } from './lesson.entity';
import { ReportCard } from '../../user/entity/reportCard.entity';

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

  @OneToMany(() => Chapter, (Chapter) => Chapter.subject)
  chapters?: Chapter[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
