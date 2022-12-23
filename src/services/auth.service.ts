import {
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import {
  RegisterUserReq,
  CreateParentReq,
  CreateStudentReq,
  LoginReq,
  UpdateParentReq,
  UpdateStudentReq,
  LoginRes,
  ResetPasswordReq,
  ResetPasswordRes,
  ForgotPasswordReq,
  ForgotPasswordRes,
  GetStudentReq,
  GetStudentRes,
  CreateStudentRes,
} from '../dto/auth.dto';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';
import { Device } from 'src/entities/device.entity';
import { generateRandomHash, isEmpty } from 'src/utils/helpers';
import { authErrors, subscriptionError } from 'src/utils/messages';
import Logger from 'src/utils/logger';
import * as bcrypt from 'bcrypt';
import { Session } from 'src/entities/session.entity';
import { UserTypes, Genders } from 'src/utils/enums';
import { UtilityService } from './utility.service';
import { CountryList } from 'src/entities/countryList.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { mailer } from 'src/utils/mailer';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly utilityService: UtilityService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Parent) private parentRepo: Repository<Parent>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(LearningPackage)
    private packageRepo: Repository<LearningPackage>,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {
    this.test();
  }

  async test() {
    const children = [
        {
          firstName: '{{$randomFirstName}}',
          lastName: '{{$randomLastName}}',
          gender: 'female',
          packages: ['7', '9', '13'],
        },
      ],
      user = {
        id: 1,
        firstName: 'Russell',
        lastName: 'Emekoba',
        gender: 'MALE',
        dateOfBirth: null,
        type: 'PARENT',
        suspended: false,
        createdAt: '2022-12-19T09:43:26.988Z',
        updatedAt: '2022-12-19T09:43:26.988Z',
        parent: {
          id: 1,
          email: 'rjemekoba@gmail.com',
          phoneNumber: '08076607130',
          address: '',
          password:
            '$2b$10$XENVPQW.hSlrmkYlGqrts.KecU0B/J0hBPYpJH0oTtmpjTrSP/5gq',
          passwordResetPin: '',
          onboardingStage: 'STAGE_0',
          createdAt: '2022-12-19T09:43:26.983Z',
          updatedAt: '2022-12-19T09:43:26.983Z',
          sessions: [],
        },
      };

    // this.createStudentProfile({
    //   children,
    //   user,
    // });
  }

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

  async recoverSession() {}

  async endSession(sessionId: string) {}

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

  async getParentDetails(
    userId: string,
    relations: Array<string>,
  ): Promise<Parent> {
    let foundParent: Parent;

    try {
      foundParent = await this.parentRepo.findOne({
        where: {
          user: { id: userId },
        },
        relations,
      });
    } catch (exp) {
      Logger.error(authErrors.checkingStudent + exp).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.queryingParent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundParent) {
      Logger.error(authErrors.parentNotFound).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.parentNotFound,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return foundParent;
  }

  async googleLogin() {}

  async registerUser(regUserReq: RegisterUserReq) {
    //* Register Basic User Details
    let { firstName, lastName, phoneNumber, email, password, countryId } =
      regUserReq;

    let duplicatePhoneNumber: User, duplicateEmail: User, createdUser: User;

    //* check if phone number is already taken
    if (!isEmpty(phoneNumber)) {
      try {
        duplicatePhoneNumber = await this.userRepo.findOne({
          where: {
            parent: {
              phoneNumber,
            },
          },
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

      if (duplicatePhoneNumber && duplicatePhoneNumber.parent.email != email) {
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

      if (duplicateEmail && duplicateEmail.parent.phoneNumber != phoneNumber) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: phoneNumber + ' : ' + 'email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    //* create user account
    try {
      password = await bcrypt.hash(password, parseInt(BCRYPT_SALT));

      const createdParent = await this.createParentProfile({
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

    mailer(createdUser.parent.email, 'Registration Successful', {
      text: `An action to change your password was successful`,
    });

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
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.checkingEmail + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundParent) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.emailNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
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
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.queryById + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
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

  async createParentProfile(createParentReq: CreateParentReq): Promise<Parent> {
    const { phoneNumber, email, password, countryId } = createParentReq;
    let createdParent: Parent;

    const country: CountryList = await this.utilityService.getCountryList(
      countryId,
    );

    try {
      createdParent = await this.parentRepo.save({
        phoneNumber,
        email,
        password,
        passwordResetPin: '',
        address: '',
        country,
        students: [],
      });
    } catch (e) {
      Logger.error(authErrors.createdParent + e).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.createdParent + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return createdParent;
  }

  async collateSubscriptionCost(packages: Array<string>): Promise<string> {
    const foundPackages: Array<LearningPackage> = await this.packageRepo.find({
      where: { id: In(packages) },
    });

    const cost = foundPackages.reduce((total, pkg) => {
      return total + parseInt(pkg.price);
    }, 0);

    return cost.toString();
  }

  async createStudentProfile(
    createStudentReq: CreateStudentReq,
  ): Promise<CreateStudentRes> {
    const { user, children } = createStudentReq;

    return Promise.all(
      children.map(
        async (child: any) =>
          await this.userRepo.save({
            firstName: child.firstName,
            lastName: child.lastName,
            gender: Genders[child.gender?.toUpperCase()],
            type: UserTypes.STUDENT,
            student: await this.studentRepo.save({
              subscription: await this.subscriptionRepo.save({
                learningPackages: child.packages,
                price: await this.collateSubscriptionCost(child.packages),
              }),
              parent: new Parent({
                id: user.parent.id,
              }),
            }),
          }),
      ),
    ).then((res: Array<User>) => ({ success: true, createdStudents: res }));
  }

  async getStudents(getStudentReq: GetStudentReq): Promise<GetStudentRes> {
    const { studentId, user } = getStudentReq;

    let foundStudents: Student | Array<Student>;

    let parent = await this.getParentDetails(user.id, ['students']);

    if (!foundStudents) {
      Logger.error(authErrors.studentsNotFound).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.studentsNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      success: true,
      students: foundStudents,
    };
  }

  async updateParentProfile(updateParentReq: UpdateParentReq) {
    const { user, email, phoneNumber, address } = updateParentReq;

    console.log(user);

    let foundUser: User, updatedParent: Parent;

    try {
      foundUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: ['parent'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.checkingParent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.parentNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedParent = await this.parentRepo.save({
        ...foundUser.parent,
        email: email ?? foundUser.parent.email,
        phoneNumber: phoneNumber ?? foundUser.parent.phoneNumber,
        address: address ?? foundUser.parent.address,
      });

      return {
        success: true,
        updatedParent,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.updatingParent,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async updateStudentProfile(updateStudentReq: UpdateStudentReq) {
    const { id, firstName, lastName, dateOfBirth } = updateStudentReq;

    let foundUser: Student;

    try {
      foundUser = await this.studentRepo.findOne({
        where: {
          id,
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.checkingStudent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.userNotFoundById,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      const user = await this.studentRepo.save({
        id,
        // dateOfBirth: dateOfBirth || foundUser.dateOfBirth,
        // parent: foundUser.parent,
      });
      return {
        success: true,
        user,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.updatingStudent,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
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

  async getDevice(deviceId: string) {
    let foundDevice: Device;

    try {
      foundDevice = await this.deviceRepo.findOne({
        where: {
          id: deviceId,
        },
      });
    } catch (exp) {
      Logger.error(authErrors.getDevice + exp);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.getDevice + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return foundDevice;
  }
}
