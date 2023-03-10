import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Student } from './student.entity';
import { Lesson } from '../../content/entity/lesson.entity';
import { Subject } from '../../content/entity/subject.entity';
import { Test } from '../../content/entity/test.entity';

@Entity('report-cards')
export class ReportCard {
  constructor(data?: ReportCard) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  remark?: string;

  @ManyToOne(() => Student, (student) => student.reportCard)
  student?: Student;

  @ManyToOne(() => Test, (test) => test.reportCard)
  test?: Test;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
