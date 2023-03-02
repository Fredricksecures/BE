import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  Get,
  Param,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserService } from 'src/modules/user/user.service';

import { EbookService } from './ebook.service';
import {
  AddEbook,
  AddToCart,
  CreateOrder,
  DeleteCart,
  EbookResponse,
  UpdateEbook,
} from './dto/ebook.dto';
import { ebookErrors } from 'src/utils/messages';

@Controller('ebook')
export class EbookController {
  constructor(
    private readonly ebookService: EbookService,
    private readonly userService: UserService,
  ) {}

  @Middleware
  async sessionGuard(req, resp) {
    await this.userService.verifyToken(req, resp, {
      noTimeout: true,
      useCookies: true,
    });
  }

  @Post('add-ebook')
  async addEbook(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() addProduct: AddEbook,
  ) {
    const { success }: EbookResponse = await this.ebookService.addEbook(
      addProduct,
    );

    if (success) {
      resp.json({
        success,
        message: ebookErrors.ebookAddedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToAddEbook,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-ebooks')
  async getEbook(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const { success, data }: EbookResponse = await this.ebookService.getEbook();

    if (success) {
      resp.json({
        success,
        data,
        message: ebookErrors.ebookFetchedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToFetchEbook,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('update-ebook')
  async updateEbook(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() updateEbook: UpdateEbook,
  ) {
    const { success, data }: EbookResponse =
      await this.ebookService.updateEbook(updateEbook);

    if (success) {
      resp.json({
        success,
        data,
        message: ebookErrors.ebookUpdatedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToUpdateEbook,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('add-to-cart')
  @UseMiddleware('sessionGuard')
  async addToCart(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() addToCart: AddToCart,
  ) {
    const { success, data }: EbookResponse = await this.ebookService.addToCart(
      req.body,
    );

    if (success) {
      resp.json({
        success,
        data,
        message: ebookErrors.ebookAddedToCart,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToAddEbookInCart,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-cart')
  @UseMiddleware('sessionGuard')
  async getCart(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const { success, data }: EbookResponse = await this.ebookService.getCart(
      req.body,
    );

    if (success) {
      resp.json({
        success,
        data,
        message: ebookErrors.cartFetched,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToFetchCart,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('delete-cart')
  @UseMiddleware('sessionGuard')
  async deleteCart(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() deleteCart: DeleteCart,
  ) {
    const { success, data }: EbookResponse = await this.ebookService.deleteCart(
      req.body,
    );

    if (success) {
      resp.json({
        success,
        message: ebookErrors.cartDeleted,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToDeleteCart,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-order')
  @UseMiddleware('sessionGuard')
  async createOrder(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() createOrder: CreateOrder,
  ) {
    const { success, data }: EbookResponse =
      await this.ebookService.createOrder(req.body);

    if (success) {
      resp.json({
        success,
        data,
        message: ebookErrors.orderCreated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToCreateOrder,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-user-ebooks')
  @UseMiddleware('sessionGuard')
  async getUserEbooks(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const { success, data }: EbookResponse =
      await this.ebookService.getUserEbooks(req.body.user);
    if (success) {
      resp.json({
        success,
        data,
        message: ebookErrors.orderCreated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: ebookErrors.failedToCreateOrder,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
