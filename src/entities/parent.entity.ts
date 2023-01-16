import { OnboardingStages } from 'src/utils/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Column,
  JoinColumn,
} from 'typeorm';
import { CountryList } from './countryList.entity';
import { Session } from './session.entity';
import { Student } from './student.entity';
import { User } from './user.entity';

@Entity('parents')
export class Parent {
  constructor(data?: Parent) {
    if (typeof data === 'object') {
      Object.keys(data).forEach((index) => {
        this[index] = data[index];
      });
    }
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @OneToOne(() => CountryList)
  @JoinColumn()
  country?: CountryList;

  @Column({ type: 'varchar', unique: true, default: null })
  email?: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar' })
  address?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @Column({ type: 'varchar' })
  passwordResetPin?: string;

  @Column({
    type: 'enum',
    enum: OnboardingStages,
    default: OnboardingStages.STAGE_0,
  })
  onboardingStage?: string;

  @OneToOne(() => User)
  user?: User;

  @OneToMany(() => Student, (Student) => Student.parent)
  students?: Student[];

  @OneToMany(() => Session, (Session) => Session.parent)
  sessions?: Session[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
