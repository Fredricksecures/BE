import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('invoices')
export class Invoices {
  constructor(data?: Invoices) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  transactionId?: string;

  @Column({ type: 'varchar' })
  currency?: string;

  @Column({ type: 'int' })
  discount?: string;

  @Column({ type: 'varchar' })
  startDate?: string;

  @Column({ type: 'varchar' })
  endedAt?: string;

  @Column({ type: 'varchar' })
  status?: string;

  @Column({ type: 'int' })
  applicationFeePercent?: string;

  @Column({ type: 'int' })
  amount?: string;

  @ManyToOne(() => Subscription)
  @JoinColumn()
  subscription?: Subscription;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
