import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Subscription } from 'src/entities/subscription.entity';
import { SubscriptionStates } from 'src/utils/enums'; 

export class CreateSubscriptionReq {

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  
  @IsNotEmpty()
  @IsString()
  learningPackages: string;

  @IsOptional()
  state: SubscriptionStates;

  @IsNotEmpty()
  dueDate: string
  
}
export class CreateSubscriptionRes {
  success: boolean;
  createdSubscription: Subscription;
}
