import { UserEbooks } from 'src/modules/ebook/entities/user.ebook.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  AddEbook,
  UpdateEbook,
  EbookResponse,
  AddToCart,
  DeleteCart,
  CreateOrder,
} from './dto/ebook.dto';
import { Ebooks } from './entities/ebook.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ebookErrors } from 'src/utils/messages';
import { Cart } from '../store/entities/cart.entity';
import { ProductType } from 'src/utils/enums';
import { User } from '../user/entity/user.entity';
import { Orders } from '../store/entities/orders.entity';
import { CartGroup } from '../store/entities/cart.group.entity';

@Injectable()
export class EbookService {
  constructor(
    @InjectRepository(Ebooks) private ebookRepo: Repository<Ebooks>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Orders) private orderRepo: Repository<Orders>,
    @InjectRepository(UserEbooks) private userEbookRepo: Repository<UserEbooks>,
    @InjectRepository(CartGroup) private cartGroupRepo: Repository<CartGroup>,
  ) {}

  async addEbook(addEbook: AddEbook): Promise<EbookResponse> {
    try {
      const {
        title,
        shortDescription,
        description,
        details,
        image,
        price,
        pdf,
        category,
        region,
        topic,
      } = addEbook;
      const product = await this.ebookRepo.save({
        title,
        shortDescription,
        description,
        details,
        image,
        pdf,
        price,
        category,
        region,
        topic,
      });
      return {
        success: true,
        data: product,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async getEbook(): Promise<EbookResponse> {
    try {
      const products = await this.ebookRepo.find();
      return {
        success: true,
        data: products,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateEbook(updateEbook: UpdateEbook): Promise<EbookResponse> {
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
        active,
      } = updateEbook;

      let ebooks: Ebooks;
      try {
        ebooks = await this.ebookRepo.findOneBy({ id });
      } catch (e) {
        Logger.error(e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.failedToFindEbook + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!ebooks) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.ebookNotFound,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      const updatedEbook = await this.ebookRepo.save({
        ...ebooks,
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
      });
      return {
        success: true,
        data: updatedEbook,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async addToCart(addToCart: AddToCart): Promise<EbookResponse> {
    try {
      const { productId, price, user } = addToCart;
      let group;

      const groupFind = await this.cartGroupRepo.findOne({
        where: {
          user: { id: user.id },
          isPaid: false,
          productType: ProductType.EBOOK,
        },
      });
      if (!groupFind) {
        group = await this.cartGroupRepo.save({
          productType: ProductType.EBOOK,
          user,
        });
      } else {
        group = groupFind;
      }
      const cart = await this.cartRepo.save({
        price,
        ebook: { id: productId },
        cartGroup: {
          id: group.id,
        },
      });
      return {
        success: true,
        data: cart,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async getCart(user: User): Promise<EbookResponse> {
    try {
      const cartGroup = await this.cartGroupRepo.findOne({
        where: {
          user: {
            id: user.id,
          },
          isPaid: false,
          productType: ProductType.EBOOK,
        },
      });

      if (!cartGroup) {
        return {
          success: true,
          data: [],
        };
      }

      let cartFound;
      try {
        cartFound = await this.cartRepo.find({
          where: {
            cartGroup: {
              id: cartGroup.id,
            },
          },
          relations: ['ebook', 'product', 'cartGroup'],
        });
      } catch (e) {
        Logger.error(e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.errorWhileFindingCart + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!cartFound) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.cartNotFound,
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
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteCart(deleteCart: DeleteCart): Promise<EbookResponse> {
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
            error: ebookErrors.errorWhileFindingCart + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!cartFound) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.cartNotFound,
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
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async createOrder(createOrder: CreateOrder): Promise<EbookResponse> {
    try {
      const { couponCode, salesCode, user } = createOrder;

      let cartFound;

      try {
        cartFound = await this.cartRepo.find({
          where: {
            cartGroup: {
              user: { id: user.id },
              isPaid: false,
              productType: ProductType.EBOOK,
            },
          },
          relations: ['ebook', 'product', 'cartGroup'],
        });
      } catch (e) {
        Logger.error(e);
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.errorWhileFindingCart + e,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!cartFound) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.cartNotFound,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (cartFound.length == 0) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: ebookErrors.cartIsEmpty,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      let orderTotal = 0;
      for (let i = 0; i < cartFound.length; i++) {
        const element = cartFound[i];
        orderTotal += Number(element.price);
      }

      const order = await this.orderRepo.save({
        user,
        orderTotal,
        productType: ProductType.EBOOK,
        couponCode,
        cartGroup: { id: cartFound[0].cartGroup.id },
        salesCode,
      });

      await this.cartGroupRepo.update(
        { id: cartFound[0].cartGroup.id },
        { isPaid: true },
      );

      for (let i = 0; i < cartFound.length; i++) {
        const element = cartFound[i];
        await this.userEbookRepo.save({
          user: {
            id: user.id,
          },
          ebook: {
            id: element.ebook.id,
          },
        });
      }

      delete order.user;
      return {
        success: true,
        data: order,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async getUserEbooks(user: User): Promise<EbookResponse> {
    try {
      const products = await this.userEbookRepo.find({
        where: {
          user: {
            id: user.id,
          },
        },
        relations: ['ebook'],
      });
      return {
        success: true,
        data: products,
      };
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.response, HttpStatus.NOT_IMPLEMENTED);
    }
  }
}
