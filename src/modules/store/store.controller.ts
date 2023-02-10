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
import {
  AddProduct,
  UpdateProduct,
  StoreResponse,
  AddToCart,
  UpdateCart,
  DeleteCart,
} from './dto/store.dto';
import { Request, Response } from 'express';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserService } from 'src/modules/user/user.service';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
  ) {}

  @Middleware
  async sessionGuard(req, resp) {
    await this.userService.verifyToken(req, resp, {
      noTimeout: true,
      useCookies: true,
    });
  }

  @Post('add-product')
  async createProduct(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() addProduct: AddProduct,
  ) {
    const { success }: StoreResponse = await this.storeService.createProduct(
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
  async getProducts(
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
  async updateProduct(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() updateProduct: UpdateProduct,
  ) {
    const { success, data }: StoreResponse =
      await this.storeService.updateProduct(updateProduct);

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

  @Post('add-to-cart')
  @UseMiddleware('sessionGuard')
  async addToCart(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() addToCart: AddToCart,
  ) {
    const { success, data }: StoreResponse = await this.storeService.addToCart(
      req.body,
    );

    if (success) {
      resp.json({
        success,
        data,
        message: storeErrors.productAddedToCart,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: storeErrors.failedToAddProductInCart,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('update-cart')
  @UseMiddleware('sessionGuard')
  async updateCart(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() updateCart: UpdateCart,
  ) {
    const { success, data }: StoreResponse = await this.storeService.updateCart(
      req.body,
    );

    if (success) {
      resp.json({
        success,
        data,
        message: storeErrors.cartUpdated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: storeErrors.failedToUpdateCart,
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
    const { success, data }: StoreResponse = await this.storeService.getCart(
      req.body,
    );

    if (success) {
      resp.json({
        success,
        data,
        message: storeErrors.cartFetched,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: storeErrors.failedToFetchCart,
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
    const { success, data }: StoreResponse = await this.storeService.deleteCart(
      req.body,
    );

    if (success) {
      resp.json({
        success,
        message: storeErrors.cartDeleted,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: storeErrors.failedToDeleteCart,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
