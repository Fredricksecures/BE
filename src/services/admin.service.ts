import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import {
  GetAllUsersSessionsReq,
  UsersSessionsReq,
  SuspendUserReq,
} from 'src/dto/admin.dto';
import { adminMessages, adminErrors } from 'src/constants';
import Logger from 'src/utils/logger';
import { Session } from 'src/entities/session.entity';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Parent) private parentRepo: Repository<Parent>,
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

  async recoverUserSessions(user: UsersSessionsReq) {
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

    let decodedUserId, token;

    try {
      const info = await this.jwtService.decode(foundSession.token);
      decodedUserId = info['id'];
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: adminErrors.tokenVerify + e,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      token = await this.jwtService.signAsync({
        id: decodedUserId,
        date: new Date().getTime(),
      });
    } catch (exp) {
      Logger.error(exp).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.tokenCreate + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      const session = await this.sessionRepo.save({
        ...foundSession,
        token,
        expired: false,
      });
      return {
        success: true,
        session,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.recoverSessionFailed,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getStudents(parentId) {
    let foundStudents: Array<Student>;
    try {
      foundStudents = await this.studentRepo.find({
        where: {
          parent: {
            id: parentId,
          },
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchStudents + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return foundStudents;
  }

  async suspendUser(params: SuspendUserReq) {
    let foundUser: User;
    try {
      foundUser = await this.userRepo.findOne({
        where: {
          id: params.userId,
        },
        relations: ['parent', 'parent.sessions'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.fetchUserFailed + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.noUserFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      foundUser = await this.userRepo.save({
        ...foundUser,
        suspended: true,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.endSessionFailed,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      foundUser.parent.sessions.map((item) => {
        return (item.expired = true);
      });
      await this.sessionRepo.save(foundUser.parent.sessions);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updateSessionFailed,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    delete foundUser.parent;
    return {
      success: true,
      user: foundUser,
    };
  }
}
