import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { Country } from 'src/entities/country.entity';
import { Device } from 'src/entities/device.entity';
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
  @IsEmail({ message: () => 'hello' })
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

export class CreateParentReq {
  email: string;
  phoneNumber: string;
  password: string;
  countryId: string;
}
