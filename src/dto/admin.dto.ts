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
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Session } from 'src/entities/session.entity';
import { CustomerCare } from 'src/entities/CustomerCare.entity';
import { User } from 'src/entities/user.entity';
import { Admin } from 'src/entities/admin.entity';

export class GetAllUsersSessionsReq {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
export class UsersSessionsReq {
  @IsNotEmpty()
  @IsString()
  sessionId: string;
}

export class SuspendUserReq {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class CustomerCareAgentReq {
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
  countryId: string;
}
export class UpdateCustomerIdReq {
  @IsNotEmpty()
  @IsString()
  Id: string;
}
export class UpdateCustomerReq {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMobilePhone()
  phoneNumber: string;

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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profilePicture: string;
}

export class BasicUpdateCustomerRes {
  updatedCustomer?: CustomerCare;
  success?: boolean;
}
export class BasicUpdateAdminRes {
  updatedAdmin?: Admin;
  success?: boolean;
}
export class GetAllUsersSessionsRes {
  sessions?: Array<Session> | undefined;
  success?: boolean;
}
export class UsersSessionsRes {
  session?: Session;
  success?: boolean;
}
export class createAdminReq {
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  isSuper: boolean;

  @IsOptional()
  @IsNumber()
  countryId: number;
}

export class updateAdminReq {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMobilePhone()
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  isSuper: boolean;
}
export class BasicRegRes {
  createdUser?: User | undefined;
  success?: boolean;
}

export class createLessonReq {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  chapterId: string;
}

export class createChapterReq {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  subjectId: string;
}
export class updateLessonReq {
  @IsNotEmpty()
  @IsString()
  type: string;
}

export class updateSubjectReq {
  @IsNotEmpty()
  @IsString()
  type: string;
}
export class createTestReq {
  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsNotEmpty()
  @IsString()
  lessonId: string;
}

export class updateTestReq {
  @IsNotEmpty()
  @IsString()
  topic: string;
}
export class createMockTestReq {
  @IsNotEmpty()
  @IsString()
  mockTestName: string;
}
export class updateMockTestReq {
  @IsNotEmpty()
  @IsString()
  mockTestName: string;
}
export class createBadgeReq {
  @IsNotEmpty()
  @IsString()
  badgeName: string;
}
export class updateBadgeReq {
  @IsNotEmpty()
  @IsString()
  badgeName: string;
}
export class createReportCardReq {
  @IsNotEmpty()
  @IsString()
  remark: string;

  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  testId: string;
}
export class updateReportCardReq {
  @IsNotEmpty()
  @IsString()
  remark: string;
}
export class createSubjectReq {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  learningPackageId: string;
}
export class updateChapterReq {
  @IsNotEmpty()
  @IsString()
  type: string;
}

export class updateSettingReq {
  @IsNotEmpty()
  @IsString()
  type: string;
}
export class SampleDto {
  First_Name: string;
  Last_Name: string;
  Age: number;
  Phone_No: number;
  Email: string;
}
export class createClassReq {
  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  startedAt: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endedAt: string;
}
export class createScheduleReq {
  @IsNotEmpty()
  @IsString()
  schedule: string;
}
export class createAttendeesReq {
  @IsNotEmpty()
  @IsString()
  attendees: string;
}
export class bulkRegistrationReq {
  @IsNotEmpty()
  @IsString()
  learningPackages: string;
}
export class bulkEmailReq {
  @IsOptional()
  @IsString()
  message: string;
}
// export class createdAdminRes {
//   createAdmin?: User | undefined;
//   success?: boolean;
// }
