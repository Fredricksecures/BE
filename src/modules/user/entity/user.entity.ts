import { CartGroup } from './../../store/entities/cart.group.entity';
import { Cart } from './../../store/entities/cart.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Student } from './student.entity';
import { Parent } from '../../auth/entity/parent.entity';
import { CustomerCare } from '../../admin/entity/customerCare.entity';
import { Genders, UserTypes } from 'src/utils/enums';
import { Admin } from '../../admin/entity/admin.entity';
import { Orders } from 'src/modules/store/entities/orders.entity';
import { UserEbooks } from 'src/modules/ebook/entities/user.ebook.entity';

@Entity('users')
export class User {
  constructor(data?: User) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ type: 'varchar' })
  firstName?: string;

  @Column({ type: 'varchar' })
  lastName?: string;

  @Column({ type: 'enum', enum: Genders, default: Genders.MALE })
  gender?: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture?: string;

  @Column({ type: 'varchar', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'enum', enum: UserTypes, default: UserTypes.PARENT })
  type?: string;

  @Column({ type: 'boolean', default: false })
  suspended?: boolean;

  @OneToOne(() => Parent)
  @JoinColumn()
  parent?: Parent;

  @OneToOne(() => CustomerCare)
  @JoinColumn()
  customerCare?: CustomerCare;

  @OneToOne(() => Admin)
  @JoinColumn()
  admin?: Admin;

  @OneToOne(() => Student)
  @JoinColumn()
  student?: Student;

  @OneToMany(() => CartGroup, (cartGroup) => cartGroup.user)
  cartGroup?: CartGroup;

  @OneToMany(() => Orders, (orders) => orders.user)
  order?: Orders;

  @OneToMany(() => UserEbooks, (userEbook) => userEbook.user)
  ebook?: UserEbooks;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
