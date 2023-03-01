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
import { CountryList } from 'src/modules/utility/entity/countryList.entity';
import { Device } from 'src/modules/auth/entity/device.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { Session } from 'src/modules/auth/entity/session.entity';
import { Student } from 'src/modules/user/entity/student.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Match } from 'src/utils/decorators';
import { MockTest } from 'src/modules/admin/entity/mockTest.entity';
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

export class mockTestResultReq {

  @IsNotEmpty()
  @IsString()
  studentID: string;

  @IsNotEmpty()
  @IsString()
  mockTestID: string;

  @IsNotEmpty()
  @IsArray()
  totalQuestions: Array<{id:string,answer:string}>;

  @IsNotEmpty()
  @IsString()
  totalTime: number;
}
