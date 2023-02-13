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
import { OrderTypes } from 'src/utils/enums';
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

  @Column({ type: 'varchar' })
  deliveryAddress?: string;

  @Column({ type: 'enum', enum: OrderTypes })
  orderType?: string;

  @Column({ type: 'varchar' })
  orderTotal?: number;

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
