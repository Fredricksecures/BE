import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  IsNotEmpty,
  IsMobilePhone,
  IsNumber,
} from 'class-validator';
import { Country } from 'src/entities/country.entity';
import { Device } from 'src/entities/device.entity';
import { Parent } from 'src/entities/parent.entity';
import { Session } from 'src/entities/session.entity';
import { User } from 'src/entities/user.entity';
import { Match } from 'src/utils/decorators';

export class MockAuthSeedDTO {
  mockDevice: Device;
  mockCountry: Country;
  mockSession: Session;
}

export class RegisterUserReq {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateIf((o) => !o.email || o.phoneNumber)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;

  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  countryId: string;
}

export class BasicRegRes {
  createdUser?: User | undefined;
  success?: boolean;
}

export class BasicUpdateRes {
  updatedParent?: Parent;
  success?: boolean;
}

export class CreateParentReq {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateIf((o) => !o.email || o.phoneNumber)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  countryId: string;
}

export class CreateStudentReq {
  @IsNotEmpty()
  @IsString()
  parentId: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class LoginReq {
  @IsOptional()
  email: string;

  @IsOptional()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  deviceId: string;
}

export class LoginRes {
  user: any;
  success: boolean;
  session: Session;
}

export class UpdateParentReq {
  user: User;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMobilePhone()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address: string;
}
export class UpdateStudentReq {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;
}
