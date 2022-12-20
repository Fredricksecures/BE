import { SubscriptionStates } from 'src/enums';
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

  @Column({ type: 'varchar' })
  price?: string;

  @Column({ type: 'varchar', array: true })
  learningPackages?: Array<string>;

  @Column({
    type: 'enum',
    enum: SubscriptionStates,
    default: SubscriptionStates.ACTIVE,
  })
  state?: SubscriptionStates;

  @OneToOne(() => Student)
  student?: Student;

  @CreateDateColumn({ type: 'timestamp' })
  dueDate?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
