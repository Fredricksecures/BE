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
import { adminMessages } from 'src/constants';
import Logger from 'src/utils/logger';
import * as bcrypt from 'bcrypt';
import { Session } from 'src/entities/session.entity';
import { UserTypes } from 'src/enums';
import { UtilityService } from './utility.service';

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
        relations: ['parent'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminMessages.checkingUser + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminMessages.userNotFoundWithId,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (foundUser.parent) {
      let foundSession: Array<Session>;
      try {
        foundSession = await this.sessionRepo.find({
          where: {
            parent: {
              id: foundUser.parent.id,
            },
          },
        });
      } catch (exp) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: adminMessages.checkingSession + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
      if (!foundSession) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: adminMessages.sessionNotFoundWithId,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
      return {
        success: true,
        sessions: foundSession,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminMessages.noParentFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
