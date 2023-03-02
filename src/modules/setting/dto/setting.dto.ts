import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
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
  