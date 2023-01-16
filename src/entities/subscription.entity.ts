import { SubscriptionStates } from 'src/utils/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Student } from './student.entity';

@Entity('subscription')
export class Subscription {
  constructor(data?: Subscription) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar', nullable: true })
  account?: string;

  @Column({ type: 'varchar' })
  details?: string;

  @Column({ type: 'varchar' })
  duration?: string;

  @Column({ type: 'varchar' })
  price?: string;

  @Column({ type: 'varchar' })
  learningPackages?: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStates,
    default: SubscriptionStates.INACTIVE,
  })
  state?: SubscriptionStates;

  @OneToOne(() => Student)
  student?: Student;

  @CreateDateColumn({ type: 'varchar' })
  dueDate?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
