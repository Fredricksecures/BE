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
import { AddEbook, EbookResponse, UpdateEbook } from './dto/ebook.dto';
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
}
