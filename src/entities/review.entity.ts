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
import { Lesson } from './lesson.entity';
import { Material } from './material.entity';
import { ReportCard } from './reportCard.entity';
import { Test } from './test.entity';

@Entity('reviews')
export class Review {
  constructor(data?: Review) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  lessonReview?: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.reviews)
  lesson?: Lesson;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
