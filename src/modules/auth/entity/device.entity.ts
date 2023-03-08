import { BrowserTypes, OSTypes } from 'src/utils/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Session } from './session.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { Settings } from 'src/modules/setting/entity/settings.entity';
@Entity('devices')
export class Device {
  constructor(data?: Device) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  type?: string;

  @Column({ type: 'varchar', nullable: true })
  ip?: string;

  @Column({ type: 'enum', enum: BrowserTypes, default: BrowserTypes.CHROME })
  client?: string;

  @Column({ type: 'enum', enum: OSTypes, default: OSTypes.UNKNOWN })
  OS?: string;

  @OneToOne(() => Session)
  session?: Session;

  @ManyToOne(() => Parent, (Parent) => Parent.devices)
  @JoinColumn()
  parent?: Parent;

  @OneToMany(() => Settings, (Settings) => Settings.devices)
  Settings?: Settings[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
