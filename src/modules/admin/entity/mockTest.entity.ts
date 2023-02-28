import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Subjects } from 'src/utils/enums';
@Entity('mock-tests')
export class MockTest {
  constructor(data?: MockTest) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  mockTestName?: string;

  @Column({ type: 'text' })
  image?: string;

  @Column({ type: 'text', default: '' })
  subjects?: string;

  @Column({ type: 'text', default: '' })
  minutes?: string;

  @Column({ type: 'text', default: '' })
  questions?: string;

  @Column({ type: 'text', default: '' })
  instructions?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
