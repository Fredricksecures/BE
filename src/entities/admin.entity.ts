import { OnboardingStages } from 'src/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { User } from './user.entity';

@Entity('admin')
export class Admin {
  constructor(data?: Admin) {
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
