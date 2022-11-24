import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Device } from './device.entity';
import { Parent } from './parent.entity';
import { User } from './user.entity';

@Entity('sessions')
export class Session {
  constructor(data?: Session) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  //* to create a session --- login, registration
  //* to restore a session --- login
  //* to end a session --- logout, close tab (close all tabs. the function will

  //* check if any tabs exist that is a teesas tab and then clears local storage if so.) This is to subvert session storage
  //* but still gain its benefits..

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar' })
  token?: string;

  @ManyToOne(() => Parent, (Parent) => Parent.sessions)
  parent?: Parent;

  @OneToOne(() => Device)
  @JoinColumn()
  device?: Device;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
