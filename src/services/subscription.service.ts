import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { subscriptionMessages, subscriptionError } from 'src/constants';
import Logger from 'src/utils/logger';
import { Subscription } from 'src/entities/subscription.entity';
import { Invoices } from 'src/entities/invoices.entity';
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
    @InjectRepository(Invoices)
    private invoicesRepo: Repository<Invoices>,
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

  async getSubscriptionHistory(subscriptionId) {
    let foundInvoices: Array<Invoices>;
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
