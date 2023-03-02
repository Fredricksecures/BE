import { UserEbooks } from './user.ebook.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cart } from 'src/modules/store/entities/cart.entity';
@Entity('ebooks')
export class Ebooks {
  constructor(data?: Ebooks) {
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
  pdf?: string;

  @Column({ type: 'varchar' })
  category?: string;

  @Column({ type: 'varchar' })
  region?: string;

  @Column({ type: 'varchar' })
  topic?: string;

  @Column({ type: 'bool', default: true })
  active?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @OneToMany(() => UserEbooks, (userEbook) => userEbook.ebook)
  user?: UserEbooks;

  @OneToMany(() => Cart, (cart) => cart.ebook)
  cart?: Cart;
}
