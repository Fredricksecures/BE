import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { GetAllUsersSessionsReq } from 'src/dto/admin.dto';
import Logger from 'src/utils/logger';
import { Session } from 'src/entities/session.entity';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class ContentService {
  constructor(
    private jwtService: JwtService, // @InjectRepository(Parent) private parentRepo: Repository<Parent>,
  ) // @InjectRepository(User) private userRepo: Repository<User>,
  // @InjectRepository(Session) private sessionRepo: Repository<Session>,
  // @InjectRepository(Student) private studentRepo: Repository<Student>,
  {}

  async getChapters(user: GetAllUsersSessionsReq) {
    // const { userId } = user;
    // let foundUser: User;
    // try {
    //   foundUser = await this.userRepo.findOne({
    //     where: { id: userId },
    //     relations: ['parent', 'parent.sessions'],
    //   });
    // } catch (exp) {
    //   Logger.error(adminErrors.checkingUser + exp);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.checkingUser + exp,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // if (!foundUser) {
    //   Logger.error(adminErrors.userNotFoundWithId);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.userNotFoundWithId,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // if (!foundUser.parent) {
    //   Logger.error(adminErrors.noParentFound);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.noParentFound,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // if (!foundUser.parent.sessions) {
    //   Logger.error(adminErrors.sessionNotFoundWithId);
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.sessionNotFoundWithId,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // return {
    //   success: true,
    //   sessions: foundUser.parent.sessions,
    // };
  }
}
