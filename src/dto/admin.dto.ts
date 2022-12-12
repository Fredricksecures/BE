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
} from 'class-validator';
import { Session } from 'src/entities/session.entity';
import { CustomerCare } from 'src/entities/CustomerCare.entity';
import { User } from 'src/entities/user.entity';

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
export class GetAllUsersSessionsRes {
  sessions?: Array<Session> | undefined;
  success?: boolean;
}
export class UsersSessionsRes {
  session?: Session;
  success?: boolean;
}
