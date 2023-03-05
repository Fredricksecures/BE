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
  ManyToMany,
} from 'typeorm';
import { CountryList } from '../../utility/entity/countryList.entity';
import { Session } from './session.entity';
import { Student } from '../../user/entity/student.entity';
import { User } from '../../user/entity/user.entity';
import { Device } from './device.entity';
import { AccountSecurities } from 'src/modules/setting/entities/setting.security.entity';
import { settingDisplay } from 'src/modules/setting/entities/setting.display.entity';
import { AccountNotification } from 'src/modules/setting/entities/setting.notification.entity';

@Entity('parents')
export class Parent {
  constructor(data?: Parent) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToMany(() => CountryList)
  @JoinColumn({ name: 'country' })
  country?: CountryList;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @Column({ type: 'varchar', nullable: true })
  passwordResetPin?: string;

  @Column({ type: 'bool', default: false })
  verified?: boolean;

  @Column({ type: 'varchar', unique: true, nullable: true })
  verificationToken?: string;

  @Column({
    type: 'enum',
    enum: OnboardingStages,
    default: OnboardingStages.STAGE_0,
  })
  onboardingStage?: string;

  @OneToOne(() => User)
  user?: User;

  @OneToMany(() => Student, (Student) => Student.parent)
  students?: Student[];

  @OneToMany(() => Session, (Session) => Session.parent)
  sessions?: Session[];

  @OneToMany(() => Device, (Device) => Device.parent)
  devices?: Device[];

  @OneToMany(() => AccountSecurities, (AccountSecurities) => AccountSecurities.parent)
  accountSecurity?: AccountSecurities[];

  @OneToMany(() => settingDisplay, (settingDisplay) => settingDisplay.parent)
  settingDisplay?: settingDisplay[];

  @OneToMany(() => AccountNotification, (AccountNotification) => AccountNotification.parent)
  accountNotification?: AccountNotification[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
