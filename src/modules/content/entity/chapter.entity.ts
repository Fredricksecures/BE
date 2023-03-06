import { LearningJourney } from 'src/modules/user/entity/learningJourney.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Subject } from './subject.entity';

@Entity('chapters')
export class Chapter {
  constructor(data?: Chapter) {
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

  @ManyToOne(() => Subject, (Subject) => Subject.chapters)
  subject?: Subject;

  @OneToMany(() => Lesson, (Lesson) => Lesson.chapter)
  lessons?: Lesson[];

  @OneToMany(
    () => LearningJourney,
    (learningJourney) => learningJourney.chapter,
  )
  learningJournies?: LearningJourney[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
