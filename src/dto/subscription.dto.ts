import { IsString, IsNotEmpty } from 'class-validator';
import { Subscription } from 'src/entities/subscription.entity';

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
