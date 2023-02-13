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
import { Parent } from 'src/entities/parent.entity';
import { Student } from 'src/entities/student.entity';
import { User } from 'src/entities/user.entity';

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
