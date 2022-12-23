import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

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

export class updateLeaderboardReq {
  @IsNotEmpty()
  @IsNumber()
  points: number;
}