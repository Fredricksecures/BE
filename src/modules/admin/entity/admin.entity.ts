import { OnboardingStages } from 'src/utils/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { CountryList } from '../../utility/entity/countryList.entity';
import { User } from '../../user/entity/user.entity';

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

  @Column({ type: 'bool', default: false })
  isSuper?: boolean;

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
