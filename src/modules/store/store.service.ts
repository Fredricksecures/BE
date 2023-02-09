import { authErrors, storeErrors } from './../../utils/messages';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AddProduct, UpdateProduct, StoreResponse } from './dto/store.dto';
import { Store } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(@InjectRepository(Store) private storeRepo: Repository<Store>) {}

  async create(addProduct: AddProduct): Promise<StoreResponse> {
    try {
      const {
        title,
        description,
        image,
        price,
        category,
        region,
        topic,
        countryId,
      } = addProduct;
      const product = await this.storeRepo.save({
        title,
        description,
        image,
        price,
        category,
        region,
        topic,
        country: {
          id: countryId,
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
      const products = await this.storeRepo.find();
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

  async update(updateProduct: UpdateProduct): Promise<StoreResponse> {
    try {
      const {
        id,
        title,
        description,
        image,
        price,
        category,
        region,
        topic,
        countryId,
        active,
      } = updateProduct;
      let product: Store;
      try {
        product = await this.storeRepo.findOneBy({ id });
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

      const updatedProduct = await this.storeRepo.save({
        ...product,
        title,
        description,
        image,
        price,
        category,
        region,
        topic,
        active,
        country: {
          id: countryId,
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
}
