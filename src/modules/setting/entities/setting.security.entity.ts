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
 
  @Entity('accountSecurity')
  export class AccountSecurities {
    constructor(data?: AccountSecurities) {
      if (typeof data === 'object') {
        Object.keys(data).forEach((index) => {
          this[index] = data[index];
        });
      }
    }
  
    @PrimaryGeneratedColumn()
    id?: string;
  
    @Column({ type: 'bool', default: false })
    informationCollection?: boolean;
  
    @Column({ type: 'bool', default: false })
    twoFactorAuth?: boolean;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;
    
    @ManyToOne(() => Device, (Device) => Device.accountSecurity)
    @JoinColumn()
    devices?: Device;

    @ManyToOne(() => Parent, (Parent) => Parent.accountSecurity)
    @JoinColumn()
    parent?: Parent;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
  
  }
  