import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { Appearence, Resolution } from 'src/utils/enums';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { Device } from 'src/modules/auth/entity/device.entity';
import { User } from '../../user/entity/user.entity';

@Entity('settings')
export class Settings {
  constructor(data?: Settings) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'enum', enum: Appearence, default: Appearence.light_theme })
  appearence?: string;

  @Column({ type: 'enum', enum: Resolution, default: Resolution.reso_4K })
  resolution?: string;

  @Column({ type: 'bool', default: false })
  bonusNotification?: boolean;

  @Column({ type: 'bool', default: false })
  practiceReminder?: boolean;

  @Column({ type: 'bool', default: false })
  emailNotification?: boolean;

  @Column({ type: 'bool', default: false })
  informationCollection?: boolean;

  @Column({ type: 'bool', default: false })
  twoFactorAuth?: boolean;

  @ManyToOne(() => Device, (Device) => Device.Settings)
  @JoinColumn()
  devices?: Device;

  // @ManyToOne(() => User, (user) => user.Settings)
  // users?: User;

  @OneToOne(() => User)
  @JoinColumn()
  users?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
