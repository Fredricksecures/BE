import { OnboardingStages } from 'src/utils/enums';
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
import { CountryList } from '../../utility/entity/countryList.entity';
import { Session } from '../../auth/entity/session.entity';
import { User } from '../../user/entity/user.entity';

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

  @OneToOne(() => CountryList)
  @JoinColumn()
  country?: CountryList;

  @OneToOne(() => User)
  user?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
