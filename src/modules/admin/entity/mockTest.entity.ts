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

  @Column({ type: 'array',default:'' })
  subjects?: Array<String>;

  @Column({ type: 'string',default:'' })
  minutes?:String;

  @Column({ type: 'string',default:'' })
  questions?:String;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
