import { BrowserTypes, OSTypes } from 'src/utils/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Session } from './session.entity';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
