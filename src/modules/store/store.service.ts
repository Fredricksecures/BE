import { User } from 'src/modules/user/entity/user.entity';
import { Cart } from './entities/cart.entity';
import { authErrors, storeErrors } from './../../utils/messages';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  AddProduct,
  UpdateProduct,
  StoreResponse,
  AddToCart,
  UpdateCart,
  DeleteCart,
} from './dto/store.dto';
import { Products } from './entities/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Products) private productRepo: Repository<Products>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
  ) {}

  async createProduct(addProduct: AddProduct): Promise<StoreResponse> {
    try {
      const {
        title,
        shortDescription,
        description,
        details,
        image,
        price,
        category,
        region,
        topic,
        countryId,
        subscriptionId,
      } = addProduct;
      const product = await this.productRepo.save({
        title,
        shortDescription,
        description,
        details,
        image,
        price,
        category,
        region,
        topic,
        country: {
          id: countryId,
        },
        subscription: {
          id: subscriptionId,
        },
      });
      return {
        success: true,
        data: product,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: storeErrors.failedToAddProduct + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getProducts(): Promise<StoreResponse> {
    try {
      const products = await this.productRepo.find({
        relations: ['subscription'],
      });
      return {
        success: true,
        data: products,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: storeErrors.failedToFetchProduct + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async updateProduct(updateProduct: UpdateProduct): Promise<StoreResponse> {
    try {
      const {
        id,
        title,
        shortDescription,
        description,
        details,
        image,
        price,
        category,
        region,
        topic,
        countryId,
        subscriptionId,
        active,
      } = updateProduct;
      let product: Products;
      try {
        product = await this.productRepo.findOneBy({ id });
      } catch (e) {
        Logger.error(e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.failedToFindProduct + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.productNotFound,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      const updatedProduct = await this.productRepo.save({
        ...product,
        title,
        shortDescription,
        description,
        details,
        image,
        price,
        category,
        region,
        topic,
        active,
        country: {
          id: countryId,
        },
        subscription: {
          id: subscriptionId,
        },
      });
      return {
        success: true,
        data: updatedProduct,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: storeErrors.failedToUpdateProduct + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async addToCart(addToCart: AddToCart): Promise<StoreResponse> {
    try {
      const { qyt, productId, price, user } = addToCart;

      const cart = await this.cartRepo.save({
        qyt,
        product: {
          id: productId,
        },
        price,
        user: {
          id: user.id,
        },
      });
      return {
        success: true,
        data: cart,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: storeErrors.failedToAddProductInCart + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async updateCart(updateCart: UpdateCart): Promise<StoreResponse> {
    try {
      const { qyt, id } = updateCart;

      let cartFound;

      try {
        cartFound = await this.cartRepo.findOneBy({ id });
      } catch (e) {
        Logger.error(e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.errorWhileFindingCart + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!cartFound) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.cartNotFound,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      const cart = await this.cartRepo.save({
        ...cartFound,
        qyt,
      });
      return {
        success: true,
        data: cart,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: storeErrors.failedToUpdateCart + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getCart(user: User): Promise<StoreResponse> {
    try {
      let cartFound;

      try {
        cartFound = await this.cartRepo.findBy({
          user: {
            id: user.id,
          },
        });
      } catch (e) {
        Logger.error(e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.errorWhileFindingCart + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!cartFound) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.cartNotFound,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
      return {
        success: true,
        data: cartFound,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: storeErrors.failedToDeleteCart + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async deleteCart(deleteCart: DeleteCart): Promise<StoreResponse> {
    try {
      const { id } = deleteCart;

      let cartFound;

      try {
        cartFound = await this.cartRepo.findOneBy({ id });
      } catch (e) {
        Logger.error(e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.errorWhileFindingCart + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!cartFound) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: storeErrors.cartNotFound,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      const cart = await this.cartRepo.delete({
        id,
      });
      return {
        success: true,
        data: cart,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: storeErrors.failedToDeleteCart + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
