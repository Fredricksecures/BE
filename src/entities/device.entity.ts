import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
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

  // @ManyToOne(() => User, (User) => User.sessions)
  // user?: User;

  @Column({ type: 'varchar', unique: true })
  type?: string;

  @Column({ type: 'varchar' })
  token?: string;

  @OneToOne(() => Session)
  session?: Session;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
