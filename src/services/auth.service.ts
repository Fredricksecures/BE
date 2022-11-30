import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { RegisterUserReq, CreateParentReq } from '../dto/auth.dto';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';
import { Device } from 'src/entities/device.entity';
import { isEmpty } from 'src/utils/helpers';
import { authErrors } from 'src/constants';
import Logger from 'src/utils/logger';
import * as bcrypt from 'bcrypt';
import { Session } from 'src/entities/session.entity';
import { UserTypes } from 'src/enums';
import { UtilityService } from './utility.service';
import { Country } from 'src/entities/country.entity';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly utilityService: UtilityService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Parent) private parentRepo: Repository<Parent>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async getDeviceInfo(deviceId: string): Promise<Device> {
    return;
  }

  async generateToken(user: User): Promise<string> {
    let token: string | {};

    try {
      token = {
        id: user.id,
        date: new Date().getTime(),
      };
      token = await this.jwtService.signAsync({ id: user.id });
    } catch (exp) {
      Logger.error(exp);

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

  async createSession(user: User, device: Device): Promise<User> {
    let createdSession: Session;

    try {
      createdSession = await this.sessionRepo.save({
        device,
        browser: 'chrome',
        user,
        token: '',
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

    return createdSession;
  }

  async recoverSession() {}

  async endSession() {}

  async registerUser(regUserReq: RegisterUserReq) {
    //* Register Basic User Details_______________________________________________________________
    let { phoneNumber, email, password, countryId } = regUserReq;

    let duplicatePhoneNumber: User, duplicateEmail: User, createdUser: User;

    //* check if phone number is already taken______________________________________________________________
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
        Logger.error(authErrors.dupPNQuery + e);

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

    //* check if email is already taken_________________________________________________________________
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
        Logger.error(authErrors.dupEmailQuery);

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

    //* create user account______________________________________________________________________________
    try {
      password = await bcrypt.hash(password, parseInt(BCRYPT_SALT));

      const createdParent = await this.createParent({
        email,
        phoneNumber,
        password,
        countryId,
      });

      createdUser = await this.userRepo.save({
        type: UserTypes.PARENT,
        parent: createdParent,
      });

      //* notify user of successful registration
      // if (createdUser) {
      //   this.notificationsBridge.notifyNewRegistration(
      //     createdUser.phoneNumber,
      //     createdUser.email,
      //     '',
      //   );
      // }
    } catch (e) {
      Logger.error(authErrors.saveUser + e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: authErrors.saveUser + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      createdUser,
      success: true,
    };
  }

  async registerStudent(reqPayload: any) {}

  async createParent(createParentReq: CreateParentReq): Promise<Parent> {
    let { phoneNumber, email, password, countryId } = createParentReq;
    let createdParent: Parent;

    const country: Country = await this.utilityService.getCountry(countryId);

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
      Logger.error(authErrors.createdParent + e);

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

  async updateParentProfile(updateParentReq) {
    try {
      let response = await this.parentRepo.find({
        where: {
          id: updateParentReq.id,
        },
      });
      if (response.length == 0) {
        return {
          success: false,
        };
      }
      await this.parentRepo.update(
        { id: updateParentReq.id },
        {
          ...(updateParentReq.email ? { email: updateParentReq.email } : {}),
          ...(updateParentReq.phoneNumber
            ? { phoneNumber: updateParentReq.phoneNumber }
            : {}),
          ...(updateParentReq.address
            ? { address: updateParentReq.address }
            : {}),
        },
      );
      response = await this.parentRepo.find({
        where: {
          id: updateParentReq.id,
        },
      });

      return {
        user: response[0],
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }

  async updateStudentProfile(updateStudentReq) {
    try {
      let response = await this.studentRepo.find({
        where: {
          id: updateStudentReq.id,
        },
      });

      if (response.length == 0) {
        return {
          success: false,
        };
      }
      await this.studentRepo.update(
        { id: updateStudentReq.id },
        {
          ...(updateStudentReq.firstName
            ? { firstName: updateStudentReq.firstName }
            : {}),
          ...(updateStudentReq.lastName
            ? { lastName: updateStudentReq.lastName }
            : {}),
          ...(updateStudentReq.dateOfBirth
            ? { dateOfBirth: updateStudentReq.dateOfBirth }
            : {}),
        },
      );
      response = await this.studentRepo.find({
        where: {
          id: updateStudentReq.id,
        },
      });

      return {
        user: response[0],
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }

  async onboardingStage1() {}

  async login(loginReq) {
    let { phoneNumber, email, password, deviceId } = loginReq;

    //* check current onboarding stage

    // createdUser = await this.userRepo.findOne({
    //   where: {
    //     id: createdUser.id,
    //   },
    //   relations: ['sessions', `${createdUser.type.toLowerCase()}`],
    // });

    const device = await this.getDeviceInfo(deviceId);

    //* create user session upon creating account
    // await this.createSession(createdUser, device);
  }
}
