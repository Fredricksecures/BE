import { MockTestQuestions } from './mockTestQuestions.entity';
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
  name?: string;

  @Column({ type: 'text' })
  image?: string;

  @Column({ type: 'varchar' })
  subjects?: string;

  @Column({ type: 'varchar' })
  minutes?: string;

  @Column({ type: 'varchar' })
  questions?: string;

  @Column({ type: 'text', default: '' })
  instructions?: string;

  @OneToMany(
    () => MockTestQuestions,
    (mockTestQuestions) => mockTestQuestions.mock_test,
  )
  question?: MockTestQuestions;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
