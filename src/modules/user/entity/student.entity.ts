import { Test } from '@nestjs/testing';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Column,
} from 'typeorm';
import { Class } from '../../liveClass/entity/class.entity';
import { Parent } from '../../auth/entity/parent.entity';
import { Subscription } from '../../subscription/entity/subscription.entity';
import { User } from './user.entity';
import { ReportCard } from './reportCard.entity';
import { Leaderboard } from '../../content/entity/leaderBoard.entity';
import { LearningJourney } from './learningJourney.entity';
import { Genders } from 'src/utils/enums';
@Entity('students')
export class Student {
  constructor(data?: Student) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @OneToOne(() => User)
  user?: User;

  @OneToOne(() => Subscription)
  subscription?: Subscription;

  @OneToMany(() => ReportCard, (reportCard) => reportCard.student)
  reportCard?: ReportCard[];

  @OneToMany(
    () => LearningJourney,
    (learningJourney) => learningJourney.student,
  )
  learningJournies?: LearningJourney[];

  @Column({type:'varchar', default: '0' })
  points?: string;

  @Column({type:'varchar', default: '0' })
  Image?: string;

  @Column({type:'varchar', default: '0' })
  firstName?: string;

  @Column({type:'varchar', default: '0' })
  lastName?: string;

  @Column({type: 'enum', enum: Genders, default: Genders.MALE })
  Gender?: string;

  @Column({type:'varchar', default: '0' })
  dateOfBirth?: Date;

  @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.student)
  leaderboard?: Leaderboard[];

  @ManyToOne(() => Parent, (Parent) => Parent.students)
  @JoinColumn()
  parent?: Parent;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
