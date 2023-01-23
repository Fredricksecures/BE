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
} from 'typeorm';
import { Class } from '../../liveClass/class.entity';
import { Parent } from '../../auth/entity/parent.entity';
import { Subscription } from '../../subscription/entity/subscription.entity';
import { User } from './user.entity';
import { ReportCard } from './reportCard.entity';
import { Leaderboard } from '../../content/entity/leaderBoard.entity';

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

  @OneToMany(() => ReportCard, (reportCard) => reportCard.student)
  reportCard?: ReportCard[];

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
