import { User } from './../../user/entity/user.entity';
import { Ebooks } from './ebook.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity('user-ebooks')
export class UserEbooks {
  constructor(data?: UserEbooks) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @ManyToOne(() => Ebooks, (ebook) => ebook.user)
  ebook?: Ebooks;

  @ManyToOne(() => User, (user) => user.ebook)
  user?: User;

  @Column({ type: 'bool', default: false })
  isCompleted?: boolean;

  @Column({ type: 'bool', default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
