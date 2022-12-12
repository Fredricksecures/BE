import { OnboardingStages } from 'src/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Column,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { Session } from './session.entity';
import { User } from './user.entity';

@Entity('customer-care')
export class CustomerCare {
  constructor(data?: CustomerCare) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar', unique: true })
  email?: string;

  @Column({ type: 'varchar', unique: true })
  phoneNumber?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @OneToOne(() => Country)
  @JoinColumn()
  country?: Country;

  @OneToOne(() => User)
  user?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
