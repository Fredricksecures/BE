import { CartGroup } from './cart.group.entity';
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
import { OrderTypes, ProductType } from 'src/utils/enums';
@Entity('orders')
export class Orders {
  constructor(data?: Orders) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar', nullable: true })
  deliveryAddress?: string;

  @Column({ type: 'enum', enum: OrderTypes, nullable: true })
  orderType?: string;

  @Column({ type: 'enum', enum: ProductType, nullable: true })
  productType?: string;

  @Column({ type: 'varchar' })
  orderTotal?: number;

  @ManyToOne(() => CartGroup, (cartGroup) => cartGroup.order)
  cartGroup?: CartGroup;

  @Column({ type: 'varchar', nullable: true })
  couponCode?: string;

  @Column({ type: 'varchar', nullable: true })
  salesCode?: string;

  @ManyToOne(() => User, (user) => user.order)
  user?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
