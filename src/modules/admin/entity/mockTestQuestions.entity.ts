import { MockTest } from 'src/modules/admin/entity/mockTest.entity';
import { CorrectAnswer } from './../../../utils/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity('mock-test-questions')
export class MockTestQuestions {
  constructor(data?: MockTestQuestions) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  question?: string;

  @Column({ type: 'text' })
  option_a?: string;

  @Column({ type: 'text', default: '' })
  option_b?: string;

  @Column({ type: 'text', default: '' })
  option_c?: string;

  @Column({ type: 'text', default: '' })
  option_d?: string;

  @Column({ type: 'enum', enum: CorrectAnswer })
  correct_answer?: string;

  @ManyToOne(() => MockTest, (mockTest) => mockTest.question)
  mock_test?: MockTest;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
