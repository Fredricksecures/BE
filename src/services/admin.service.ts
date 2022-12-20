import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
var moment = require('moment');
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
//import { FilterOperator, Paginate, PaginateQuery, paginate, Paginated } from 'nestjs-paginate'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  GetAllUsersSessionsReq,
  UsersSessionsReq,
  SuspendUserReq,
  CustomerCareAgentReq,
  UpdateCustomerReq,
  UpdateCustomerIdReq,
  createAdminReq,
  updateAdminReq,
} from 'src/dto/admin.dto';
import { adminMessages, adminErrors } from 'src/constants';
import Logger from 'src/utils/logger';
import { Session } from 'src/entities/session.entity';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';
import { Admin } from 'src/entities/admin.entity';
import { CustomerCare } from 'src/entities/customerCare.entity';
import { isEmpty } from 'src/utils/helpers';
import * as bcrypt from 'bcrypt';
import { UserTypes } from 'src/enums';
import { UtilityService } from './utility.service';
import { CountryList } from 'src/entities/countryList.entity';

config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private readonly utilityService: UtilityService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(CustomerCare)
    private customerCareRepo: Repository<CustomerCare>,
    @InjectRepository(Parent) private parentRepo: Repository<Parent>,
  ) {}

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
      case UserTypes.CUSTOMERCARE:
        delete user?.password;
        delete user?.passwordResetPin;
        delete user?.onboardingStage;
        break;

      default:
        break;
    }

    return user;
  }

  async getUserSessions(
    user: GetAllUsersSessionsReq,
    options: IPaginationOptions,
  ): Promise<Pagination<Session>> {
    const { userId } = user;
    let foundUser;
    //let foundUser

    try {
      foundUser = this.userRepo
        .createQueryBuilder('User')
        .leftJoinAndSelect('User.parent', 'parent.session');
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
    console.log(foundUser);
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
    return paginate<Session>(foundUser, options);
    //success: true,

    // };
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

  async getStudents(
    parentId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Student>> {
    let results, total;
    try {
      results = await this.studentRepo.createQueryBuilder('Student');
      if (parentId != null) {
        results.where('Student.parentId = :parentId', { parentId });
      }
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchStudents + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Student>(results, options);
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

  async createCustomerCareAgent(params: CustomerCareAgentReq) {
    let { firstName, lastName, email, phoneNumber, password, countryId } =
      params;

    let duplicatePhoneNumber: User,
      duplicateEmail: User,
      createdCustomerCare: User;

    if (!isEmpty(phoneNumber)) {
      try {
        duplicatePhoneNumber = await this.userRepo.findOne({
          where: {
            customerCare: {
              phoneNumber,
            },
          },
          relations: ['customerCare'],
        });
      } catch (e) {
        Logger.error(adminErrors.dupPNQuery + e).console();

        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: adminErrors.dupPNQuery + e,
          },
          HttpStatus.CONFLICT,
        );
      }

      if (
        duplicatePhoneNumber &&
        duplicatePhoneNumber.customerCare.phoneNumber != phoneNumber
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

    if (!isEmpty(email)) {
      try {
        duplicateEmail = await this.userRepo.findOne({
          where: {
            customerCare: {
              email,
            },
          },
          relations: ['customerCare'],
        });
      } catch {
        Logger.error(adminErrors.dupEmailQuery).console();

        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: adminErrors.dupEmailQuery,
          },
          HttpStatus.CONFLICT,
        );
      }

      if (duplicateEmail && duplicateEmail.customerCare.email != email) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: email + ' : ' + 'email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    try {
      password = await bcrypt.hash(password, parseInt(BCRYPT_SALT));
      const createdParent = await this.createCustomerCare({
        email,
        phoneNumber,
        password,
        countryId,
      });
      createdCustomerCare = await this.userRepo.save({
        firstName,
        lastName,
        type: UserTypes.CUSTOMERCARE,
        customerCare: createdParent,
      });
    } catch (e) {
      Logger.error(adminErrors.saveUser + e).console();
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveUser + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      success: true,
      createdCustomerCare,
    };
  }

  async createCustomerCare(params): Promise<CustomerCare> {
    const { phoneNumber, email, password, countryId } = params;
    let createdCustomerCare: CustomerCare;

    const country: CountryList = await this.utilityService.getCountryList(
      countryId,
    );

    try {
      createdCustomerCare = await this.customerCareRepo.save({
        phoneNumber,
        email,
        password,
        country,
      });
    } catch (e) {
      Logger.error(adminErrors.customerCareCreateFailed + e).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminMessages.addCustomerCareSuccess + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return createdCustomerCare;
  }

  async updateCustomerProfile(id, updateCustomerReq: UpdateCustomerReq) {
    const {
      email,
      phoneNumber,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      profilePicture,
    } = updateCustomerReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');

    let foundUser: User, updatedCustomer: CustomerCare;

    try {
      foundUser = await this.userRepo.findOne({
        where: { id: id },
        relations: ['customerCare'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingCustomer + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.customerNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedCustomer = await this.customerCareRepo.save({
        ...foundUser.customerCare,
        email: email ?? foundUser.customerCare.email,
        phoneNumber: phoneNumber ?? foundUser.customerCare.phoneNumber,
        updatedAt: date,
      });

      return {
        success: true,
        updatedCustomer,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingCustomer,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getCustomers(
    options: IPaginationOptions,
  ): Promise<Pagination<CustomerCare>> {
    let foundCustomers;
    try {
      foundCustomers = await this.customerCareRepo.createQueryBuilder(
        'CustomerCare',
      );
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchCustomers + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<CustomerCare>(foundCustomers, options);
  }

  async createAdmin(createAdminReq: createAdminReq) {
    //* Register Basic User Details_______________________________________________________________
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      gender,
      countryId,
      isSuper,
    } = createAdminReq;

    let duplicatePhoneNumber: User, duplicateEmail: User, createdUser: User;

    //* check if phone number is already taken______________________________________________________________
    if (!isEmpty(phoneNumber)) {
      try {
        duplicatePhoneNumber = await this.userRepo.findOne({
          where: {
            admin: {
              phoneNumber,
            },
          },
          relations: ['admin'],
        });
        console.log(duplicatePhoneNumber);
      } catch (e) {
        Logger.error(adminErrors.dupPNQuery + e).console();

        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: adminErrors.dupPNQuery + e,
          },
          HttpStatus.CONFLICT,
        );
      }

      if (
        duplicatePhoneNumber &&
        duplicatePhoneNumber.admin.phoneNumber == phoneNumber
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

    //* check if email is already taken_________________________________________________________________
    if (!isEmpty(email)) {
      try {
        duplicateEmail = await this.userRepo.findOne({
          where: {
            admin: {
              email,
            },
          },
          relations: ['admin'],
        });
        console.log(duplicateEmail);
      } catch {
        Logger.error(adminErrors.dupEmailQuery).console();

        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: adminErrors.dupEmailQuery,
          },
          HttpStatus.CONFLICT,
        );
      }

      if (duplicateEmail && duplicateEmail.admin.email == email) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: email + ' : ' + 'email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    //* create admin account______________________________________________________________________________
    try {
      const createdAdmin = await this.adminRepo.save({
        email,
        phoneNumber,
        isSuper,
        countryId,
      });

      createdUser = await this.userRepo.save({
        firstName,
        lastName,
        gender,
        type: UserTypes.ADMIN,
        admin: createdAdmin,
      });
    } catch (e) {
      Logger.error(adminErrors.saveUser + e).console();

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveUser + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      createdUser,
      success: true,
    };
  }

  async getAdmin(options: IPaginationOptions): Promise<Pagination<Admin>> {
    let foundAdmin;

    try {
      foundAdmin = await this.adminRepo.createQueryBuilder('Admin');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchAdmin + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Admin>(foundAdmin, options);
  }

  async updateAdminProfile(id: string, updateAdminReq: updateAdminReq) {
    const { email, phoneNumber, isSuper } = updateAdminReq;

    let foundUser, updatedAdmin: Admin;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    try {
      foundUser = await this.adminRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingAdmin + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.adminNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedAdmin = await this.adminRepo.save({
        ...foundUser,
        email: email ?? foundUser.email,
        phoneNumber: phoneNumber ?? foundUser.phoneNumber,
        isSuper: isSuper ?? foundUser.isSuper,
        updatedAt: date,
      });

      return {
        success: true,
        updatedAdmin,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingAdmin,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getUsers(
    userId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    let results, total;
    try {
      console.log(userId);
      results = await this.userRepo.createQueryBuilder('User');
      if (userId != null) {
        results.where('Id = :userId', { userId });
      }
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchUsers + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<User>(results, options);
  }
}
