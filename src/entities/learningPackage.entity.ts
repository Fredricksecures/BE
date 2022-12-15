import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { LearningPackageList } from './learningPackageList.entity';
import { Student } from './student.entity';
import { Subject } from './subject.entity';
import { Subscription } from './subscription.entity';

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
  packageListId?: string;

  @ManyToOne(
    () => Subscription,
    (Subscription) => Subscription.learningPackages,
  )
  subscription?: Subscription;

  // @OneToMany(
  //   () => LearningPackageList,
  //   (LearningPackageList) => LearningPackageList.learningPackage,
  // )
  // @JoinColumn()
  // learningPackageLists?: LearningPackageList[];

  @OneToOne(() => LearningPackageList)
  @JoinColumn()
  learningPackageListItem?: LearningPackageList;

  @OneToMany(() => Subject, (Subject) => Subject.learningPackage)
  subjects?: Array<Subject>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
