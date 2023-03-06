import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { User } from 'src/modules/user/entity/user.entity';
export class updateStudentProfileReq {
    
    @IsString()
    imageURL: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    gender: string;

    @IsDate()
    dateOfBirth: Date;
  }
  
  export class GetStudentReq {
    @IsString()
    parentId: string;
  
    @IsNotEmpty()
    @IsString()
    user: User;
  }


  export class createStudentProfileReq {
    
    @IsOptional()
    @IsString()
    imageURL: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    gender: string;

    @IsNotEmpty()
    @IsDate()
    dateOfBirth: Date;

  }
  
  export class updateAccountSettingsReq
  {
    @IsOptional()
    @IsString()
    appearence: string;

    @IsOptional()
    @IsString()
    resolution: string;

    @IsOptional()
    @IsBoolean()
    informationCollection: boolean;

    @IsOptional()
    @IsBoolean()
    twoFactorAuth: boolean;

    @IsOptional()
    @IsBoolean()
    bonusNotification: boolean;

    @IsOptional()
    @IsBoolean()
    practiceReminder: boolean;

    @IsOptional()
    @IsBoolean()
    emailNotification: boolean;
  }

 