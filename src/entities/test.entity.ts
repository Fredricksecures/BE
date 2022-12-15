import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Chapter } from './chapter.entity';
import { LearningPackage } from './learningPackage.entity';
import { Lesson } from './lesson.entity';
import { ReportCard } from './reportCard.entity';

@Entity('tests')
export class Test {
  constructor(data?: Test) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  topic?: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.tests)
  lesson?: Lesson;

  @OneToMany(() => ReportCard, (reportCard) => reportCard.test)
  reportCard?: ReportCard[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
