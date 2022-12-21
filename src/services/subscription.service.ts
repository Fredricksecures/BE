import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subscriptionMessages, subscriptionError } from 'src/utils/messages';
import { Subscription } from 'src/entities/subscription.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import { Invoice } from 'src/entities/invoice.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
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

  async getSubscriptions(options: IPaginationOptions) : Promise<Pagination<Subscription>>{
    let foundSubscriptions;

    try {
      foundSubscriptions = await this.subscriptionRepo.createQueryBuilder('Subscription')
        // .relation('learningPackages');
      
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
    return paginate<Subscription>(foundSubscriptions, options);
  }

  //!: GANESH change "getsubscriptionhistory" to "getinvoices". for admin module
  async getSubscriptionHistory(
    subscriptionId: string,
    options: IPaginationOptions,
    details: string,
    date: Date,
  ): Promise<Pagination<Invoice>> {
    let foundInvoices;

    try {
      foundInvoices = await this.invoicesRepo
        .createQueryBuilder('Invoice')
        .where('Invoice.subscriptionId = :subscriptionId', { subscriptionId });
      // foundInvoices = await this.invoicesRepo.find({
      //   where: {
      //     subscription: {
      //       id: subscriptionId,
      //     },
      //   },
      // });
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
    return paginate<Invoice>(foundInvoices, options);
  }
}
