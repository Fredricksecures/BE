import { MaterialTypes } from 'src/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('materials')
export class Material {
  constructor(data?: Material) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar', default: MaterialTypes.VIDEO })
  type?: string;

  @ManyToOne(() => Lesson, (Lesson) => Lesson.materials)
  lesson?: Lesson;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
