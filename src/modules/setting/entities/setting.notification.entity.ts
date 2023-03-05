import { Device } from 'src/modules/auth/entity/device.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    ManyToOne
  } from 'typeorm';
 
  @Entity('accountNotification')
  export class AccountNotification {
    constructor(data?: AccountNotification) {
      if (typeof data === 'object') {
        Object.keys(data).forEach((index) => {
          this[index] = data[index];
        });
      }
    }
  
    @PrimaryGeneratedColumn()
    id?: string;
  
    @Column({ type: 'bool', default: false })
    bonusNotification?: boolean;
  
    @Column({ type: 'bool', default: false })
    practiceReminder?: boolean;
    
    @Column({ type: 'bool', default: false })
    emailNotification?: boolean;
  
    @ManyToOne(() => Parent, (Parent) => Parent.accountNotification)
    @JoinColumn()
    parent?: Parent;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  
  }
  