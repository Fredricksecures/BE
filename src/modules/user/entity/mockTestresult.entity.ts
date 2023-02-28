import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { MockTest } from 'src/modules/admin/entity/mockTest.entity';
  @Entity('mock-test-results')
  export class MockTestResult {
    constructor(data?: MockTestResult) {
      if (typeof data === 'object') {
        Object.keys(data).forEach((index) => {
          this[index] = data[index];
        });
      }
    }
  
    @PrimaryGeneratedColumn()
    id?: string;
  
    @Column({ type: 'varchar' })
    studentID?: string;
  
    @Column({ type: 'varchar' })
    mockTestID?: MockTest;
  
    @Column({ type: 'integer' })
    totalPercentage?: number;

    @Column({ type: 'integer' })
    totalTime?: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  }
  