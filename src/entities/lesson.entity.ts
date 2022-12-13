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
import { Subject } from './subject.entity';

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
  type?: string;

  @ManyToOne(() => Chapter, (Chapter) => Chapter.lessons)
  chapter?: Chapter;

  @OneToMany(() => Material, (Material) => Material.lesson)
  materials?: Material[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
