import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  
  
  
  @Entity('badges')
  export class Badge {
    constructor(data?: Badge) {
      if (typeof data === 'object') {
        Object.keys(data).forEach((index) => {
          this[index] = data[index];
        });
      }
    }
  
    @PrimaryGeneratedColumn()
    id?: string;
  
    @Column({ type: 'varchar' })
    badgeName?: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  }
  