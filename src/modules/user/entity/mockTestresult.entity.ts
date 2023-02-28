import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
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
  
    @Column({ type: 'array' })
    totalQuestions?: Array<{ id: string }>;

    @Column({ type: 'varchar' })
    totalTime?: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  }
  