import {
  IsEmail,
  IsOptional,
  IsString,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { Device } from 'src/entities/device.entity';
import { Session } from 'src/entities/session.entity';

export class signUpReq {
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
  countryId: string;
}

export class signInReq {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  deviceId: Device;
}
export class SignInRes {
  user: any;
  success: boolean;
  session: Session;
}
