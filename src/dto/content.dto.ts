import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class updateLeaderboardReq {
  @IsNotEmpty()
  @IsNumber()
  points: number;
}

export class addReviewReq {
  @IsNotEmpty()
  @IsString()
  lessonReview: string;

  @IsNotEmpty()
  @IsString()
  lessonId: string;
}
export class updateMockTestReq {
  @IsNotEmpty()
  @IsString()
  mockTestName: string;

  @IsNotEmpty()
  @IsString()
  subject: string;
}