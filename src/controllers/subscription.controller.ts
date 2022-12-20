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
} from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service';
import { Request, Response } from 'express';
import { subscriptionError, subscriptionMessages } from 'src/constants';
import { CreateSubscriptionReq } from 'src/dto/subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly authService: SubscriptionService) {}

  @Get('all')
  async getSubscriptions(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const { success, subscriptions } =
      await this.authService.getSubscriptions();

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: subscriptionMessages.fetchSubscriptionSuccess,
        subscriptions,
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

  @Get('invoice/:subscriptionId')
  async getSubscriptionInvoices(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('subscriptionId') subscriptionId,
  ) {
    const { success, history } = await this.authService.getSubscriptionInvoices(
      subscriptionId,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: subscriptionMessages.fetchInvoiceHistorySuccess,
        history,
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
