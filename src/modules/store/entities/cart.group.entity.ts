import { Orders } from 'src/modules/store/entities/orders.entity';
import { Cart } from 'src/modules/store/entities/cart.entity';
import { OrderTypes } from './../../../utils/enums';
import { Ebooks } from './../../ebook/entities/ebook.entity';
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
  OneToMany,
} from 'typeorm';
import { ProductType } from 'src/utils/enums';
@Entity('cart-group')
export class CartGroup {
  constructor(data?: CartGroup) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'enum', enum: ProductType })
  productType?: string;

  @Column({ type: 'bool', default: false })
  isPaid?: boolean;

  @ManyToOne(() => User, (user) => user.cartGroup)
  user?: User;

  @OneToMany(() => Cart, (cart) => cart.cartGroup)
  cart?: Cart;

  @OneToMany(() => Orders, (orders) => orders.cartGroup)
  order?: Orders;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
