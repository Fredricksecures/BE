import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Class } from 'src/modules/admin/class.entity';
import { liveClassMessages, liveClassErrors } from 'src/utils/messages';
import Logger from 'src/utils/logger';

@Injectable()
export class LiveClassService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {}

  //!:GANESH for classroom module
  async getUpcomingClasses(
    options: IPaginationOptions,
  ): Promise<Pagination<Class>> {
    let foundUpcomingClasses;
    try {
      foundUpcomingClasses = await this.classRepo.createQueryBuilder('Classes');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: liveClassErrors.failedToFetchUpcomingClasses + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Class>(foundUpcomingClasses, options);
  }
}
