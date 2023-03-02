import { Cart } from './cart.entity';
import { Subscription } from '../../subscription/entity/subscription.entity';
import { CountryList } from '../../utility/entity/countryList.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
@Entity('products')
export class Products {
  constructor(data?: Products) {
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

  @ManyToOne(() => Subscription, (subscription) => subscription.store)
  subscription?: Subscription;

  @OneToMany(() => Cart, (cart) => cart.product)
  cart?: Cart;

  @Column({ type: 'bool', default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
