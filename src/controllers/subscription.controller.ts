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
} from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service';
import { Request, Response } from 'express';
import { subscriptionError, subscriptionMessages } from 'src/constants';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly authService: SubscriptionService) {}

  @Get('subscriptions')
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
}
