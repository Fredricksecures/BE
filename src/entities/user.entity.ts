import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Parent } from './parent.entity';
import { Genders } from 'src/enums';

@Entity('users')
export class User {
  constructor(data?: User) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  firstName?: string;

  @Column({ type: 'varchar' })
  lastName?: string;

  @Column({ type: 'varchar', default: Genders.MALE })
  gender?: string;

  @Column({ type: 'varchar' })
  profilePicture?: string;

  @Column({ type: 'varchar', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'varchar' })
  type?: string;

  @Column({ type: 'boolean', default: false })
  suspended?: boolean;

  @OneToOne(() => Parent)
  @JoinColumn()
  parent?: Parent;

  @OneToOne(() => Student)
  @JoinColumn()
  student?: Student;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
