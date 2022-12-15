import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
import { ClassState } from 'src/enums';
import { Student } from './student.entity';
import { Lesson } from './lesson.entity';
import { Subject } from './subject.entity';
import { Test } from './test.entity';
  
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
    remarks?: string;

    @ManyToOne(() => Lesson, (lesson) => lesson.reportCard)
    lesson?: Lesson;
  
    @ManyToOne(() => Student, (student) => student.reportCard)
    student?: Student;

    @ManyToOne(() => Subject, (subject) => subject.reportCard)
    subject?: Subject;

    @ManyToOne(() => Test, (test) => test.reportCard)
    test?: Test;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  }
  