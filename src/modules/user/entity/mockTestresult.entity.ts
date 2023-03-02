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
    mockTestID?: string;
  
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalPercentage?: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalTime?: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  }
  