import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subscriptionMessages, subscriptionError } from 'src/constants';
import { Subscription } from 'src/entities/subscription.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import { Invoice } from 'src/entities/invoice.entity';
import {
  CreateSubscriptionReq,
  CreateSubscriptionRes,
} from 'src/dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(LearningPackage)
    private sessionRepo: Repository<LearningPackage>,
    @InjectRepository(Invoice)
    private invoicesRepo: Repository<Invoice>,
  ) {}

  async createSubscription(
    params: CreateSubscriptionReq,
  ): Promise<CreateSubscriptionRes> {
    return;
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    return;
  }

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

  async getSubscriptionInvoices(subscriptionId: string) {
    let foundInvoices: Array<Invoice>;

    try {
      foundInvoices = await this.invoicesRepo.find({
        where: {
          subscription: {
            id: subscriptionId,
          },
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: subscriptionError.checkingInvoices + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundInvoices) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: subscriptionError.fetchInvoicesFailed,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      history: foundInvoices,
    };
  }
}
