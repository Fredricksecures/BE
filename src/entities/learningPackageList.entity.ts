import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { LearningPackage } from './learningPackage.entity';

@Entity('learning-package-list')
export class LearningPackageList {
  constructor(data?: LearningPackageList) {
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
  type?: string;

  // @ManyToOne(
  //   () => LearningPackage,
  //   (LearningPackage) => LearningPackage.learningPackageLists,
  // )
  // learningPackage?: LearningPackage;

  @OneToOne(() => LearningPackage)
  learningPackage?: LearningPackage;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
