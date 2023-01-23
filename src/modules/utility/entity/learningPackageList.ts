import { PackageTypes } from 'src/utils/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subject } from '../../content/entity/subject.entity';

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
  price?: string;

  @Column({
    type: 'enum',
    enum: PackageTypes,
    default: PackageTypes.PRIMARY_SCHOOL,
  })
  type?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
