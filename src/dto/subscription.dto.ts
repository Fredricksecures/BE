import { IsString, IsNotEmpty } from 'class-validator';
import { Session } from 'src/entities/session.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { User } from 'src/entities/user.entity';

export class CreateSubscriptionReq {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  countryId: string;
}
export class CreateSubscriptionRes {
  success: boolean;
  createdSubscription: Subscription;
}
