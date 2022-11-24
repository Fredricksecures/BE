import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity('countries')
export class Country {
  constructor(data?: Country) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @OneToOne(() => User)
  user?: User;

  @Column({ type: 'varchar', unique: true })
  name?: string;

  @Column({ type: 'bool', default: false })
  supported?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
