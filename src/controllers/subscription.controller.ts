import {
  Query,
  Controller,
  HttpStatus,
  Res,
  Get,
  Req,
  Patch,
  Body,
  HttpException,
  Param,
  Post,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service';
import { Request, Response } from 'express';
import { subscriptionError, subscriptionMessages } from 'src/utils/messages';
import { CreateSubscriptionReq } from 'src/dto/subscription.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly authService: SubscriptionService) {}

  @Get('all')
  async getSubscriptions(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const  subscriptions =
      await this.authService.getSubscriptions(options);
    console.log(subscriptions.items)
    if (subscriptions) {
      resp.json({
        status: HttpStatus.OK,
        message: subscriptionMessages.fetchSubscriptionSuccess,
        subscriptions: subscriptions.items,
        meta:subscriptions.meta
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: subscriptionError.fetchSubscriptionFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  // @Get('all')
  // async getSubscriptions(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) resp: Response,
    
  // ) {
    
  //   const  {Success,subscriptions} =
  //     await this.authService.getSubscriptions();
   
  //   if (Success) {
  //     resp.json({
  //       status: HttpStatus.OK,
  //       message: subscriptionMessages.fetchSubscriptionSuccess,
  //       subscriptions
  //     });
  //   } else {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: subscriptionError.fetchSubscriptionFailed,
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }

  @Get('invoice/:subscriptionId')
  async getSubscriptionInvoices(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
    @Query() filters,
    @Param('subscriptionId') subscriptionId,
  ) {
    const options: IPaginationOptions = { limit, page };
    const history = await this.authService.getSubscriptionHistory(
      subscriptionId,
      options,
      filters.details,
      filters.date,
    );

    if (history) {
      resp.json({
        status: HttpStatus.OK,
        message: subscriptionMessages.fetchInvoiceHistorySuccess,
        history: history.items,
        meta: history.meta,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: subscriptionError.fetchInvoicesFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create')
  async createSubscription(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: CreateSubscriptionReq,
  ) {
    const { success, createdSubscription } =
      await this.authService.createSubscription(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: subscriptionMessages.create,
        subcription: createdSubscription,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: subscriptionError.create,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
