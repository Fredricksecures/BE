import { PackageTypes } from 'src/utils/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subject } from '../admin/subject.entity';

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

  @Column({
    type: 'enum',
    enum: PackageTypes,
    default: PackageTypes.PRIMARY_SCHOOL,
  })
  type?: string;

  @OneToMany(() => Subject, (Subject) => Subject.learningPackage)
  subjects?: Array<Subject>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
