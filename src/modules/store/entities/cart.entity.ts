import { User } from './../../user/entity/user.entity';
import { Products } from './products.entity';
import { Subscription } from './../../subscription/entity/subscription.entity';
import { CountryList } from './../../utility/entity/countryList.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity('cart')
export class Cart {
  constructor(data?: Cart) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  qyt?: number;

  @Column({ type: 'varchar' })
  price?: number;

  @ManyToOne(() => Products, (products) => products.cart)
  product?: Products;

  @ManyToOne(() => User, (user) => user.cart)
  user?: User;

  @Column({ type: 'bool', default: false })
  isPaid?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
