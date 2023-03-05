import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Appearence, Resolution } from 'src/utils/enums';
import { Parent } from 'src/modules/auth/entity/parent.entity';

@Entity('settingDisplay')
export class settingDisplay {
  constructor(data?: settingDisplay) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'enum', enum: Appearence, default: Appearence.light_theme })
  appearence?: string;

  @Column({ type: 'enum', enum: Resolution, default: Resolution.reso_4K })
  resolution?: string;

  @ManyToOne(() => Parent, (Parent) => Parent.settingDisplay)
    @JoinColumn()
    parent?: Parent;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

}
