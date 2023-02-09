import { CountryList } from './../../utility/entity/countryList.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
@Entity('store')
export class Store {
  constructor(data?: Store) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  title?: string;

  @Column({ type: 'text' })
  shortDescription?: string;

  @Column({ type: 'text' })
  description?: string;

  @Column({ type: 'text' })
  details?: string;

  @Column({ type: 'text' })
  image?: string;

  @Column({ type: 'varchar' })
  price?: number;

  @Column({ type: 'varchar' })
  category?: string;

  @Column({ type: 'varchar' })
  region?: string;

  @Column({ type: 'varchar' })
  topic?: string;

  @ManyToOne(() => CountryList)
  country?: CountryList;

  @Column({ type: 'bool', default: true })
  active?: boolean;
}
