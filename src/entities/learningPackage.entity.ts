import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subject } from './subject.entity';

@Entity('learning-packages')
export class LearningPackage {
  constructor(data?: LearningPackage) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  name?: string;

  @Column({ type: 'varchar' })
  price?: string;

  @Column({ type: 'varchar' })
  type?: string;

  @OneToMany(() => Subject, (Subject) => Subject.learningPackage)
  subjects?: Array<Subject>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
