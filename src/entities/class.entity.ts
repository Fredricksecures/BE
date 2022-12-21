import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ClassStates } from 'src/utils/enums';
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

  @Column({ type: 'enum', enum: ClassStates, default: ClassStates.STARTED })
  state?: string;

  @ManyToOne(() => Student, (student) => student.classes)
  student?: Student;

  @Column({ type: 'timestamp' })
  startedAt?: Date;

  @Column({ type: 'timestamp' })
  endedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
