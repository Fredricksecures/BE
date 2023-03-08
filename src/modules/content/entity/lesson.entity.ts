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
import { ReportCard } from '../../user/entity/reportCard.entity';
import { Review } from './review.entity';
import { Test } from './test.entity';
import { LearningJourney } from 'src/modules/user/entity/learningJourney.entity';

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
  title?: string;

  @ManyToOne(() => Chapter, (Chapter) => Chapter.lessons)
  chapter?: Chapter;

  @OneToMany(() => Material, (Material) => Material.lesson)
  materials?: Material[];

  @OneToMany(() => LearningJourney, (learningJourney) => learningJourney.lesson)
  learningJournies?: LearningJourney[];

  @OneToMany(() => Test, (test) => test.lesson)
  tests?: Test[];

  @OneToMany(() => Review, (review) => review.lesson)
  reviews?: Review[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
