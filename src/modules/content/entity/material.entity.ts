import { MaterialTypes } from 'src/utils/enums';
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

  @Column({ type: 'enum', enum: MaterialTypes, default: MaterialTypes.VIDEO })
  type?: MaterialTypes;

  @Column('varchar', { nullable: true })
  url?: string;

  @Column('varchar', { nullable: true })
  content?: string;

  @Column('varchar')
  title?: string;

  @Column('varchar', { nullable: true })
  cover?: string;

  @Column('varchar', { nullable: true })
  thumbNail?: string;

  @ManyToOne(() => Lesson, (Lesson) => Lesson.materials)
  lesson?: Lesson;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
