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
  IsArray,
} from 'class-validator';
import { CountryList } from 'src/entities/countryList.entity';
import { Device } from 'src/entities/device.entity';
import { Parent } from 'src/entities/parent.entity';
import { Session } from 'src/entities/session.entity';
import { Student } from 'src/entities/student.entity';
import { User } from 'src/entities/user.entity';
import { Match } from 'src/utils/decorators';

export class MockAuthSeedDTO {
  mockDevice: Device;
  mockCountryList: CountryList;
  mockSession: Session;
}

export class RegisterUserReq {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

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

class StudentReqObj {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  packages: Array<string>;
}

export class CreateStudentReq {
  user: User;

  @IsArray()
  children: Array<StudentReqObj>;
}

export class CreateStudentRes {
  success: boolean;
  createdStudents: Array<Student>;
}

export class GetStudentReq {
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  user: User;
}

export class GetStudentRes {
  success: boolean;
  students: Student | Array<Student>;
}

export class LoginReq {
  @IsOptional()
  email: string;

  @IsOptional()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  device: Device;
}

export class LoginRes {
  user: any;
  success: boolean;
  session: Session;
}

export class ForgotPasswordReq {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}

export class ForgotPasswordRes {
  resetPin: string;
}
export class ResetPasswordReq {
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}

export class ResetPasswordRes {
  success: boolean;
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
