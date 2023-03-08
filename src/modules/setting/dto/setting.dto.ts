import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { User } from 'src/modules/user/entity/user.entity';
  export class GetStudentReq {
    @IsString()
    parentId: string;
  
    @IsNotEmpty()
    @IsString()
    user: User;
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

 