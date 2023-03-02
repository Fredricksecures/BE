import { CartGroup } from './cart.group.entity';
import { Ebooks } from './../../ebook/entities/ebook.entity';
import { User } from './../../user/entity/user.entity';
import { Products } from './products.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductType } from 'src/utils/enums';
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

  @Column({ type: 'varchar', nullable: true })
  qyt?: number;

  @Column({ type: 'varchar' })
  price?: number;

  @ManyToOne(() => Products, (products) => products.cart, { nullable: true })
  product?: Products;

  @ManyToOne(() => CartGroup, (cartGroup) => cartGroup.cart)
  cartGroup?: CartGroup;

  @ManyToOne(() => Ebooks, (ebooks) => ebooks.cart, { nullable: true })
  ebook?: Ebooks;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
