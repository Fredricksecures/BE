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
  
  import { Match } from 'src/utils/decorators';

export class signInReq {
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
  