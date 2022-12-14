import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
  } from 'typeorm';
  import { Chapter } from './chapter.entity';
  import { LearningPackage } from './learningPackage.entity';
  import { Lesson } from './lesson.entity';
  
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
  
    @ManyToOne(() => Lesson, (Lesson) => Lesson.tests)
  lesson?: Lesson;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  }
  