import { Chapter } from 'src/modules/content/entity/chapter.entity';
import { Lesson } from 'src/modules/content/entity/lesson.entity';
import { Subject } from 'src/modules/content/entity/subject.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Student } from './student.entity';

@Entity('learning-journies')
export class LearningJourney {
  constructor(data?: LearningJourney) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @ManyToOne(() => Student, (student) => student.learningJournies)
  @JoinColumn()
  student?: Student;

  @ManyToOne(() => Subject, (subject) => subject.learningJournies)
  @JoinColumn()
  subject?: Subject;

  @ManyToOne(() => Chapter, (chapter) => chapter.learningJournies)
  @JoinColumn()
  chapter?: Chapter;

  @ManyToOne(() => Lesson, (lesson) => lesson.learningJournies)
  @JoinColumn()
  lesson?: Lesson;

  @Column('varchar', { default: 0 })
  completion?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
