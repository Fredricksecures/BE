import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AddEbook, UpdateEbook, EbookResponse } from './dto/ebook.dto';
import { Ebooks } from './entities/ebook.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ebookErrors } from 'src/utils/messages';

@Injectable()
export class EbookService {
  constructor(
    @InjectRepository(Ebooks) private ebookRepo: Repository<Ebooks>,
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
}
