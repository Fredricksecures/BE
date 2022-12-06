import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { GetAllUsersSessionsReq } from 'src/dto/admin.dto';

import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';
import { Device } from 'src/entities/device.entity';
import { isEmpty } from 'src/utils/helpers';
import { adminMessages, adminErrors } from 'src/constants';
import Logger from 'src/utils/logger';
import { Session } from 'src/entities/session.entity';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async getUserSessions(user: GetAllUsersSessionsReq) {
    const { id } = user;
    let foundUser: User;

    try {
      foundUser = await this.userRepo.findOne({
        where: { id },
        //! RUSS: added the session here so we dont have to fetch twice
        relations: ['parent', 'parent.sessions'],
      });
    } catch (exp) {
      Logger.error(adminErrors.checkingUser + exp);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingUser + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      Logger.error(adminErrors.userNotFoundWithId);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.userNotFoundWithId,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser.parent) {
      Logger.error(adminErrors.noParentFound);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.noParentFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser.parent.sessions) {
      Logger.error(adminErrors.sessionNotFoundWithId);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.sessionNotFoundWithId,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    // let foundSession: Array<Session>;

    // try {
    //   foundSession = await this.sessionRepo.find({
    //     where: {
    //       parent: {
    //         id: foundUser.parent.id,
    //       },
    //     },
    //   });
    // } catch (exp) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminMessages.checkingSession + exp,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }

    // if (!foundSession) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminMessages.sessionNotFoundWithId,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }

    return {
      success: true,
      sessions: foundUser.parent.sessions,
    };
  }
}
