import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { subscriptionMessages, subscriptionError } from 'src/constants';
import Logger from 'src/utils/logger';
import { Subscription } from 'src/entities/subscription.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class SubscriptionService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(LearningPackage)
    private sessionRepo: Repository<LearningPackage>,
  ) {}

  async getSubscriptions() {
    let foundSubscriptions: Array<Subscription>;

    try {
      foundSubscriptions = await this.subscriptionRepo.find({
        relations: ['learningPackages'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: subscriptionError.checkingSubscription + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundSubscriptions) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: subscriptionError.failedToFetchSubscriptions,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      subscriptions: foundSubscriptions,
    };
  }
}
