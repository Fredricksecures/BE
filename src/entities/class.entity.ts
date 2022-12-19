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
  
  @Entity('classes')
  export class Class {
    constructor(data?: Class) {
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

    @Column({ type: 'varchar', default: ClassState.STARTED })
    classState?: string;
  
    @ManyToOne(() => Student, (student) => student.classes)
    student?: Student;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  }
  