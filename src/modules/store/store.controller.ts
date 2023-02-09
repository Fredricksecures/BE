import { storeErrors } from './../../utils/messages';
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
import { StoreService } from './store.service';
import { AddProduct, UpdateProduct, StoreResponse } from './dto/store.dto';
import { Request, Response } from 'express';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('add-product')
  async create(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() addProduct: AddProduct,
  ) {
    const { success }: StoreResponse = await this.storeService.create(
      addProduct,
    );

    if (success) {
      resp.json({
        success,
        message: storeErrors.productAddedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: storeErrors.failedToAddProduct,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-products')
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const { success, data }: StoreResponse =
      await this.storeService.getProducts();

    if (success) {
      resp.json({
        success,
        data,
        message: storeErrors.productFetchedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: storeErrors.failedToFetchProduct,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('update-product')
  async update(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() updateProduct: UpdateProduct,
  ) {
    const { success, data }: StoreResponse = await this.storeService.update(
      updateProduct,
    );

    if (success) {
      resp.json({
        success,
        data,
        message: storeErrors.productUpdatedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: storeErrors.failedToUpdateProduct,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
