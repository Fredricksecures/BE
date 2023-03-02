import { Products } from './../../store/entities/products.entity';
import { SubscriptionStates } from 'src/utils/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Student } from '../../user/entity/student.entity';

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

  @Column({ type: 'varchar', nullable: true })
  details?: string;

  @Column({ type: 'varchar', nullable: true })
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

  @OneToMany(() => Products, (products) => products.subscription)
  store?: Products;

  @CreateDateColumn({ type: 'varchar' })
  dueDate?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
