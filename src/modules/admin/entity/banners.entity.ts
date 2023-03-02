import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BannerType } from 'src/utils/enums';
@Entity('banners')
export class Banners {
  constructor(data?: Banners) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'enum', enum: BannerType })
  bannerType?: string;

  @Column({ type: 'varchar' })
  url?: string;

  @Column({ type: 'varchar' })
  redirectUrl?: string;

  @Column({ type: 'bool', default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
