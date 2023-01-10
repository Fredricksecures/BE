import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import {
  RegisterUserReq,
  LoginReq,
  LoginRes,
  ResetPasswordReq,
  ResetPasswordRes,
  ForgotPasswordReq,
  ForgotPasswordRes,
} from '../dto/auth.dto';
import { signInReq } from 'src/dto/signIn.dto';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';
import { Device } from 'src/entities/device.entity';
import { generateRandomHash, isEmpty } from 'src/utils/helpers';
import { authErrors } from 'src/utils/messages';
import Logger from 'src/utils/logger';
import * as bcrypt from 'bcrypt';
import { Session } from 'src/entities/session.entity';
import { UserTypes } from 'src/utils/enums';
import { UtilityService } from './utility.service';
import { mailer } from 'src/utils/mailer';
import { UserService } from './user.service';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly utilityService: UtilityService,
    private readonly userService: UserService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Parent) private parentRepo: Repository<Parent>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async generateToken(user: User): Promise<string> {
    let token: string;

    try {
      token = await this.jwtService.signAsync({
        id: user.id,
        date: new Date().getTime(),
      });
    } catch (exp) {
      Logger.error(exp).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.tokenCreate + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return token.toString();
  }

  async verifyToken(
    req,
    resp,
    options?: { noTimeout: boolean; useCookies: boolean },
  ) {
    let decodedId: string;
    let decodedDate: Date;
    let token: string;
    let foundUser: User;

    if (options.useCookies) {
      token = req.cookies['jwt'];

      try {
        const { id, date } = await this.jwtService.verifyAsync(token);

        decodedId = id;
        decodedDate = date;
      } catch (e) {
        Logger.error(e).console();

        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: authErrors.noCookieTokenPassed + e,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: authErrors.noAuthTokenPassed,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      try {
        const token = (authorization as string).match(
          /(?<=([b|B]earer )).*/g,
        )?.[0];

        const { id, date } = await this.jwtService.verifyAsync(token);

        decodedId = id;
        decodedDate = date;
      } catch (e) {
        Logger.error(e);

        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: authErrors.invalidToken + e,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    if (!decodedId) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: authErrors.invalidToken,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      foundUser = await this.userRepo.findOne({
        where: { id: decodedId },
        relations: ['parent.sessions'],
      });

      if (!foundUser) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: authErrors.noTokenIdMatch,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'could not verify token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const foundActiveSection = foundUser.parent.sessions.find(
      (e) => e.expired === false && e.token === token,
    );

    if (!foundActiveSection) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: authErrors.sessionExpired,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    req.body.user = foundUser;
  }

  async createSession(user: User, device: Device): Promise<Session> {
    let createdSession: Session;

    try {
      createdSession = await this.sessionRepo.save({
        // device,
        parent: user.parent,
        token: await this.generateToken(user),
      });
    } catch (e) {
      Logger.error(`${authErrors.createSession}--- ${e}`);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: `${authErrors.createSession}--- ${e}`,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    delete createdSession.parent;
    return createdSession;
  }

  async formatPayload(user: any, type: string) {
    switch (type) {
      case UserTypes.DEFAULT:
        delete user?.createdAt;
        delete user?.updatedAt;
        delete user?.parent?.id;
        delete user?.parent?.createdAt;
        delete user?.parent?.updatedAt;
        delete user?.parent?.password;
        delete user?.parent?.passwordResetPin;
        break;

      case UserTypes.PARENT:
        delete user?.password;
        delete user?.passwordResetPin;
        delete user?.onboardingStage;
        break;

      default:
        break;
    }

    return user;
  }

  async googleLogin() {}

  async registerUser(regUserReq: RegisterUserReq) {
    //* Register Basic User Details
    let { firstName, lastName, phoneNumber, email, password, countryId } =
      regUserReq;

    let duplicatePhoneNumber: User, duplicateEmail: User, createdUser: User;

    //* check if phone number is already taken
    if (isEmpty(phoneNumber)) {
      try {
        duplicatePhoneNumber = await this.userRepo.findOne({
          where: {
            parent: {
              phoneNumber,
            },
          },
          relations: ['parent'],
        });
      } catch (e) {
        Logger.error(authErrors.dupPNQuery + e).console();

        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: authErrors.dupPNQuery + e,
          },
          HttpStatus.CONFLICT,
        );
      }
      if (
        duplicatePhoneNumber &&
        duplicatePhoneNumber.parent.phoneNumber == phoneNumber
      ) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `phone number ( ${phoneNumber} ) is already taken`,
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    //* check if email is already taken
    if (!isEmpty(email)) {
      try {
        duplicateEmail = await this.userRepo.findOne({
          where: {
            parent: {
              email,
            },
          },
          relations: ['parent'],
        });
      } catch {
        Logger.error(authErrors.dupEmailQuery).console();

        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: authErrors.dupEmailQuery,
          },
          HttpStatus.CONFLICT,
        );
      }
      //console.log(duplicatePhoneNumber.parent)
      if (duplicateEmail && duplicateEmail.parent.email == email) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: email + ' : ' + 'email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    //* create user account
    try {
      password = await bcrypt.hash(password, parseInt(BCRYPT_SALT));

      const createdParent = await this.userService.createParentProfile({
        email,
        phoneNumber,
        password,
        countryId,
      });
      createdUser = await this.userRepo.save({
        firstName,
        lastName,
        type: UserTypes.PARENT,
        parent: createdParent,
      });
    } catch (e) {
      Logger.error(authErrors.saveUser + e).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.saveUser + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    // mailer(createdUser.parent.email, 'Registration Successful', {
    //   text: `An action to change your password was successful`,
    // });

    return {
      createdUser,
      success: true,
    };
  }

  async login(loginReq: LoginReq): Promise<LoginRes> {
    let { phoneNumber, email, password, device } = loginReq;

    let foundUser: User;

    //* find user with matching email / phone-number
    try {
      foundUser = await this.userRepo.findOneOrFail({
        where: { parent: email ? { email } : { phoneNumber } },
        relations: ['parent'],
      });
    } catch (exp) {
      Logger.error(exp).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.checkingEmail + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.emailNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    //* compare provided with password in DB
    // try {

    if (!(await bcrypt.compare(password, foundUser.parent.password))) {
      Logger.error(authErrors.invalidPassword).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.invalidPassword,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    // } catch (exp) {
    //   Logger.error(authErrors.invalidPassword + exp).console();

    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: authErrors.checkingPassword + exp,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }

    //* create user session
    const newSession = await this.createSession(foundUser, device);

    //* send notification to user
    // await this.notificationsBridge.notifyNewLogin({
    //   recipientEmail: foundUser.email,
    //   recipientPhoneNumber: foundUser.phoneNumber,
    // });

    return {
      success: true,
      user: foundUser,
      session: newSession,
    };
  }

  async forgotPassword(body: ForgotPasswordReq): Promise<ForgotPasswordRes> {
    const { email, phoneNumber } = body;

    let foundParent: Parent;

    //* find user with matching email / phone-number
    try {
      foundParent = await this.parentRepo.findOneOrFail({
        where: email ? { email } : { phoneNumber },
      });
    } catch (exp) {
      Logger.error(exp).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.checkingEmail,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!foundParent) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.emailNotFound,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    //* generate reset token
    const resetPin: string = generateRandomHash(6);

    //* save reset pin to user db
    try {
      this.parentRepo.save({
        ...foundParent,
        passwordResetPin: resetPin,
      });
    } catch (exp) {
      Logger.error(authErrors.savePin + exp).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.savePin + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    //* send notification to user
    // this.notificationsBridge.sendPasswordResetPin({
    //   recipientEmail: email,
    //   resetPin,
    // });

    return {
      resetPin,
    };
  }

  async resetPassword(body: ResetPasswordReq): Promise<ResetPasswordRes> {
    const { email, phoneNumber, password } = body;

    let foundParent: Parent;

    //* get user from id.
    try {
      foundParent = await this.parentRepo.findOneOrFail({
        where: email ? { email } : { phoneNumber },
      });
    } catch (e) {
      Logger.error(authErrors.queryById + e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.queryById,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    //* check if user was found.
    if (!foundParent) {
      Logger.error(authErrors.userNotFoundById).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.userNotFoundById,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    //* check if the new password is the same as the previous one.
    if (await bcrypt.compare(password, foundParent.password)) {
      Logger.error(authErrors.sameNewAndPrevPassword).console();

      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: authErrors.sameNewAndPrevPassword,
        },
        HttpStatus.CONFLICT,
      );
    }

    //* save the new password
    try {
      this.parentRepo.save({
        ...foundParent,
        password: await bcrypt.hash(password, parseInt(BCRYPT_SALT)),
      });
    } catch (e) {
      Logger.error(authErrors.savingNewPword + e).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.savingNewPword + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    //* send notification to user.
    // this.notificationsBridge.sendPasswordUpdatedNotification(foundUser.email);

    return {
      success: true,
    };
  }

  async logout(all: any, token: string) {
    //! this is a security breach. intruders can log a user out of all their sessions
    //! if they get their hand on any token even an expired one.
    //! let use a session guard to get the id and in the process, bounce requests
    //! from expired tokens

    const { id } = await this.jwtService.verifyAsync(token);

    if (all) {
      let foundUser: User;

      try {
        foundUser = await this.userRepo.findOne({
          where: {
            id,
          },
          relations: ['parent.sessions'],
        });
      } catch (exp) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: authErrors.findingUserWithId + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!foundUser) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: authErrors.findingUserWithId,
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
            error: authErrors.logoutFailed,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      return {
        success: true,
      };
    } else {
      let foundSession: Session;

      try {
        foundSession = await this.sessionRepo.findOne({
          where: { token },
        });
      } catch (exp) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: authErrors.checkingSession + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!foundSession) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: authErrors.checkingSession,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      try {
        await this.sessionRepo.save({
          ...foundSession,
          expired: true,
        });
      } catch (exp) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: authErrors.logoutFailed + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      return {
        success: true,
      };
    }
  }

  async signIn(regUserReq: signInReq) {
    //* Register Basic User Details
    let { firstName, lastName, phoneNumber, email, countryId } = regUserReq;
    if (!phoneNumber) {
      phoneNumber = '';
    }
    let duplicatePhoneNumber: User, duplicateEmail: User, createdUser: User;

    //* check if email is already taken
    if (!isEmpty(email)) {
      try {
        duplicateEmail = await this.userRepo.findOne({
          where: {
            parent: {
              email,
            },
          },
          relations: ['parent'],
        });
      } catch {
        Logger.error(authErrors.dupEmailQuery).console();

        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: authErrors.dupEmailQuery,
          },
          HttpStatus.CONFLICT,
        );
      }
      //console.log(duplicatePhoneNumber.parent)
      if (duplicateEmail && duplicateEmail.parent.email == email) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: email + ' : ' + 'email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    //* create user account
    try {
      let password = generateRandomHash(6);

      const createdParent = await this.userService.createParentProfile({
        email,
        phoneNumber,
        password,
        countryId,
      });
      createdUser = await this.userRepo.save({
        firstName,
        lastName,
        type: UserTypes.PARENT,
        parent: createdParent,
      });
    } catch (e) {
      Logger.error(authErrors.saveUser + e).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.saveUser + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    // mailer(createdUser.parent.email, 'Registration Successful', {
    //   text: `An action to change your password was successful`,
    // });

    return {
      createdUser,
      success: true,
    };
  }
}
