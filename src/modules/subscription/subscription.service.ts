import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subscriptionMessages, subscriptionError } from 'src/utils/messages';
import { Subscription } from 'src/modules/subscription/subscription.entity';
import { LearningPackage } from 'src/modules/utility/learningPackage.entity';
import { Invoice } from 'src/modules/subscription/invoice.entity';
import { SubscriptionStates } from 'src/utils/enums';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  CreateSubscriptionReq,
  CreateSubscriptionRes,
} from 'src/modules/subscription/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(LearningPackage)
    private lPLRepo: Repository<LearningPackage>,
    @InjectRepository(Invoice)
    private invoicesRepo: Repository<Invoice>,
  ) {}

  // async createSubscription(
  //   params: CreateSubscriptionReq,
  // ): Promise<CreateSubscriptionRes> {
  //   return;
  // }

  async createSubscription(
    CreateSubscriptionReq: CreateSubscriptionReq,
  ): Promise<CreateSubscriptionRes> {
    const { details, duration, price, learningPackages, state, dueDate } =
      CreateSubscriptionReq;
    let createdSubscription: Subscription,
      foundLearningPackage: LearningPackage;

    const learningPackagesId = learningPackages.split(',');

    // Used to check the Booked Class value is present in student table
    for (let index = 0; index < learningPackagesId.length; index++) {
      const id = learningPackagesId[index];
      foundLearningPackage = await this.lPLRepo.findOne({
        where: { id },
      });
      if (foundLearningPackage == null) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: subscriptionError.lPLNotFound + id,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
    }

    try {
      createdSubscription = await this.subscriptionRepo.save({
        details,
        duration,
        price,
        learningPackages,
        state: state ?? SubscriptionStates.INACTIVE,
        dueDate,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: subscriptionError.savedSubscription + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      createdSubscription,
      success: true,
    };
  }

  // async getSubscription(subscriptionId: string): Promise<Subscription> {
  //   return;
  // }

  async getSubscriptions(
    options: IPaginationOptions,
  ): Promise<Pagination<Subscription>> {
    let foundSubscriptions;

    try {
      foundSubscriptions = await this.subscriptionRepo.createQueryBuilder(
        'Subscription',
      );
      //relations: ['learningPackages'],
      // });
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

  // async getSubscriptions() {
  //   let foundSubscriptions: Array<Subscription>;

  //   try {
  //     foundSubscriptions = await this.subscriptionRepo.find({
  //       relations: ['learningPackages'],
  //    });
  //   } catch (exp) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_IMPLEMENTED,
  //         error: subscriptionError.checkingSubscription + exp,
  //       },
  //       HttpStatus.NOT_IMPLEMENTED,
  //     );
  //   }

  //   if (!foundSubscriptions) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_IMPLEMENTED,
  //         error: subscriptionError.failedToFetchSubscriptions,
  //       },
  //       HttpStatus.NOT_IMPLEMENTED,
  //     );
  //   }
  //   return {Success:true,subscriptions:foundSubscriptions}
  // }

  async getSubscriptionHistory(
    subscriptionId: string,
    options: IPaginationOptions,
    deatils: string,
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
