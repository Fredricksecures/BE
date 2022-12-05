import { BrowserTypes } from 'src/enums';
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

  @Column({ type: 'varchar', default: BrowserTypes.CHROME })
  browser?: string;

  @OneToOne(() => Session)
  session?: Session;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
