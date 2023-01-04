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
import { Material } from './material.entity';
import { ReportCard } from './reportCard.entity';
import { Review } from './review.entity';
import { Test } from './test.entity';

@Entity('lessons')
export class Lesson {
  constructor(data?: Lesson) {
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

  @ManyToOne(() => Chapter, (Chapter) => Chapter.lessons)
  chapter?: Chapter;

  @OneToMany(() => Material, (Material) => Material.lesson)
  materials?: Material[];

  @OneToMany(() => Test, (test) => test.lesson)
  tests?: Test[];

  @OneToMany(() => Review, (review) => review.lesson)
  reviews?: Review[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
