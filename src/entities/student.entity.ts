import { Test } from '@nestjs/testing';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Class } from './class.entity';
import { LearningPackage } from './learningPackage.entity';
import { Parent } from './parent.entity';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';
import { ReportCard } from './reportCard.entity';
import { Leaderboard } from './leaderBoard.entity';

@Entity('students')
export class Student {
  constructor(data?: Student) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @OneToOne(() => User)
  user?: User;

  @OneToOne(() => Subscription)
  subscription?: Subscription;

  @OneToMany(() => Class, (Class) => Class.student)
  classes?: Class[];

  @OneToMany(() => ReportCard, (reportCard) => reportCard.student)
  reportCard?: ReportCard[];

  @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.student)
  leaderboard?: Leaderboard[];

  @ManyToOne(() => Parent, (Parent) => Parent.students)
  parent?: Parent;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
