import { IsString, IsNotEmpty } from 'class-validator';

import { Session } from 'src/entities/session.entity';
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

export class GetAllUsersSessionsRes {
  sessions?: Array<Session> | undefined;
  success?: boolean;
}
export class UsersSessionsRes {
  session?: Session;
  success?: boolean;
}
