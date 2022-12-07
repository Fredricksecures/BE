import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { GetAllUsersSessionsReq, UsersSessionsReq } from 'src/dto/admin.dto';
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
    const { userId } = user;
    let foundUser: User;

    try {
      foundUser = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['parent', 'parent.sessions'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingUser + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.userNotFoundWithId,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser.parent) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.noParentFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser.parent.sessions) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.sessionNotFoundWithId,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      sessions: foundUser.parent.sessions,
    };
  }

  async endUserSessions(user: UsersSessionsReq) {
    const { sessionId } = user;
    let foundSession: Session;

    try {
      foundSession = await this.sessionRepo.findOne({
        where: { id: sessionId },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingSession + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundSession) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.sessionNotFoundWithId,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      const session = await this.sessionRepo.save({
        ...foundSession,
        expired: true,
      });
      return {
        success: true,
        session,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.endSessionFailed,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async refreshUserSessions(user: UsersSessionsReq) {
    const { sessionId } = user;
    let foundSession: Session;

    try {
      foundSession = await this.sessionRepo.findOne({
        where: { id: sessionId },
        relations: ['parent', 'parent.user'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingSession + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundSession) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.sessionNotFoundWithId,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    // this.jwtService.signAsync(
    //   {
    //     sub: userId,
    //     username,
    //   },
    //   {
    //     secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    //     expiresIn: '7d',
    //   },
    // )

    // try {
    //   const session = await this.sessionRepo.save({
    //     ...foundSession,
    //     expired: true,
    //   });
    //   return {
    //     success: true,
    //     session,
    //   };
    // } catch (e) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.endSessionFailed,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
  }

}
