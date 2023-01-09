import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Index, Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserService } from './user.service';
import { mailer } from 'src/utils/mailer';
import {
  GetAllUsersSessionsReq,
  UsersSessionsReq,
  SuspendUserReq,
  CustomerCareAgentReq,
  UpdateCustomerReq,
  createAdminReq,
  updateAdminReq,
  createLessonReq,
  updateLessonReq,
  createChapterReq,
  updateSubjectReq,
  createTestReq,
  updateTestReq,
  createMockTestReq,
  updateMockTestReq,
  createBadgeReq,
  updateBadgeReq,
  updateReportCardReq,
  createReportCardReq,
  createSubjectReq,
  updateChapterReq,
  updateSettingReq,
} from 'src/dto/admin.dto';
import {
  adminMessages,
  adminErrors,
  authErrors,
  authMessages,
} from 'src/utils/messages';
import Logger from 'src/utils/logger';
import { Session } from 'src/entities/session.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Chapter } from 'src/entities/chapter.entity';
import { Subject } from 'src/entities/subject.entity';
import { Student } from 'src/entities/student.entity';
import { Parent } from 'src/entities/parent.entity';
import { Admin } from 'src/entities/admin.entity';
import { CustomerCare } from 'src/entities/customerCare.entity';
import { Test } from 'src/entities/test.entity';
import { MockTest } from 'src/entities/mockTest.entity';
import { Badge } from 'src/entities/badges.entity';
import { isEmpty } from 'src/utils/helpers';
import * as bcrypt from 'bcrypt';
import { UserTypes } from 'src/utils/enums';
import { UtilityService } from './utility.service';
import { AuthService } from './auth.service';
import { CountryList } from 'src/entities/countryList.entity';
import { Class } from 'src/entities/class.entity';
import { ReportCard } from 'src/entities/reportCard.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import { Settings } from 'src/entities/settings.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { response } from 'express';
const excelToJSON = require('convert-excel-to-json');

var fs = require('fs');
config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private readonly utilityService: UtilityService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Chapter) private chapterRepo: Repository<Chapter>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
    @InjectRepository(MockTest) private mockTestRepo: Repository<MockTest>,
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
    @InjectRepository(ReportCard)
    private reportCardRepo: Repository<ReportCard>,
    @InjectRepository(CustomerCare)
    private customerCareRepo: Repository<CustomerCare>,
    @InjectRepository(LearningPackage)
    private learningPackageRepo: Repository<LearningPackage>,
    @InjectRepository(Settings) private settingRepo: Repository<Settings>, // @InjectRepository(Parent) private parentRepo: Repository<Parent>,
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
      results = this.studentRepo.createQueryBuilder('Student');
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

  async createLesson(createLessonReq: createLessonReq) {
    const { type, chapterId } = createLessonReq;
    let lessonCreated: Lesson, foundChapterId: Chapter;
    try {
      foundChapterId = await this.chapterRepo.findOne({
        where: {
          id: chapterId,
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingChapter + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundChapterId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchSubjectById,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      lessonCreated = await this.lessonRepo.save({
        type,
        chapter: foundChapterId,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveLesson + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      lessonCreated,
      success: true,
    };
  }

  async createChapter(createChapterReq: createChapterReq) {
    const { type, subjectId } = createChapterReq;
    let chapterCreated: Chapter, foundSubjectId: Subject;
    try {
      foundSubjectId = await this.subjectRepo.findOne({
        where: {
          id: subjectId,
        },
      });
      console.log(foundSubjectId);
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingSubject + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundSubjectId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchSubjectById,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      chapterCreated = await this.chapterRepo.save({
        type,
        subject: foundSubjectId,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveChapter + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      chapterCreated,
      success: true,
    };
  }

  async updateLessonProfile(id: string, updateLessonReq: updateLessonReq) {
    const { type } = updateLessonReq;
    let foundLesson: Lesson, updatedLesson: Lesson;

    try {
      foundLesson = await this.lessonRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingLesson + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundLesson) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.lessonNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      updatedLesson = await this.lessonRepo.save({
        ...foundLesson,
        type: type ?? foundLesson.type,
      });

      return {
        success: true,
        updatedLesson,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingLesson,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async updateSubjectProfile(id: string, updateSubjectReq: updateSubjectReq) {
    const { type } = updateSubjectReq;
    let foundSubject, updatedSubject: Subject;

    try {
      foundSubject = await this.subjectRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingSubject + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundSubject) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.subjectNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedSubject = await this.subjectRepo.save({
        ...foundSubject,
        type: type ?? foundSubject.type,
      });

      return {
        success: true,
        updatedSubject,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingSubject,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  //!:GANESH for admin module
  async createTest(createTestReq: createTestReq) {
    const { topic, lessonId } = createTestReq;
    let testCreated: Test, foundLessonId: Lesson;
    try {
      foundLessonId = await this.lessonRepo.findOne({
        where: {
          id: lessonId,
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingLesson + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundLessonId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchLessons,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      testCreated = await this.testRepo.save({
        topic,
        lesson: foundLessonId,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveTest + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      testCreated,
      success: true,
    };
  }

  //!:GANESH "update test". for admin module
  async updateTestProfile(id: string, updateTestReq: updateTestReq) {
    const { topic } = updateTestReq;
    let foundTest, updatedTest: Test;

    try {
      foundTest = await this.testRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundTest) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.testNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedTest = await this.testRepo.save({
        ...foundTest,
        topic: topic ?? foundTest.topic,
      });

      return {
        success: true,
        updatedTest,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingTest,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async createMockTest(createMockTestReq: createMockTestReq) {
    const { mockTestName } = createMockTestReq;
    let mockTestCreated: MockTest;

    try {
      mockTestCreated = await this.mockTestRepo.save({
        mockTestName,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveMockTest + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      mockTestCreated,
      success: true,
    };
  }

  //!:GANESH "update mock". for admin module
  async updateMockTestProfile(
    id: string,
    updateMockTestReq: updateMockTestReq,
  ) {
    const { mockTestName } = updateMockTestReq;
    let foundMockTest, updatedMockTest: Badge;

    try {
      foundMockTest = await this.mockTestRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingMockTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundMockTest) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.mockTestNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedMockTest = await this.mockTestRepo.save({
        ...foundMockTest,
        mockTestName: mockTestName ?? foundMockTest.mockTestName,
      });

      return {
        success: true,
        updatedMockTest,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingMockTest,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async createBadge(createBadgeReq: createBadgeReq) {
    const { badgeName } = createBadgeReq;
    let badgeCreated: Badge;

    try {
      badgeCreated = await this.badgeRepo.save({
        badgeName,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveBadge + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      badgeCreated,
      success: true,
    };
  }

  async updateBadgeProfile(id: string, updateBadgeReq: updateBadgeReq) {
    const { badgeName } = updateBadgeReq;
    let foundBadge, updatedBadge: Badge;

    try {
      foundBadge = await this.badgeRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingBadge + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundBadge) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.badgeNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedBadge = await this.badgeRepo.save({
        ...foundBadge,
        badgeName: badgeName ?? foundBadge.badgeName,
      });

      return {
        success: true,
        updatedBadge,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingBadge,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  //!:GANESH for admin module
  async createReportCard(createReportCardReq: createReportCardReq) {
    const { remark, lessonId, subjectId, studentId, testId } =
      createReportCardReq;
    let reportCardCreated: Test,
      foundLessonId: Lesson,
      foundSubjectId: Subject,
      foundTestId: Test,
      foundStudentId: Student;
    try {
      foundStudentId = await this.studentRepo.findOne({
        where: {
          id: studentId,
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
    if (!foundStudentId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToStudent,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      foundTestId = await this.testRepo.findOne({
        where: {
          id: testId,
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundTestId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchTest,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      foundLessonId = await this.lessonRepo.findOne({
        where: {
          id: lessonId,
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingLesson + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundLessonId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchLesson,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      foundSubjectId = await this.subjectRepo.findOne({
        where: {
          id: subjectId,
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingSubject + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundSubjectId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchSubjectById,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      reportCardCreated = await this.reportCardRepo.save({
        remark,
        lesson: foundLessonId,
        student: foundStudentId,
        test: foundTestId,
        subject: foundSubjectId,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveReportCard + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      reportCardCreated,
      success: true,
    };
  }

  //!:GANESH "update report card". for admin module
  async updateReportCardProfile(
    id: string,
    updateReportCardReq: updateReportCardReq,
  ) {
    const { remark } = updateReportCardReq;
    let foundReoprtCard, updatedReportCard: ReportCard;

    try {
      foundReoprtCard = await this.reportCardRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingReportCard + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundReoprtCard) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.reportCardNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedReportCard = await this.reportCardRepo.save({
        ...foundReoprtCard,
        remark: remark ?? foundReoprtCard.remark,
      });

      return {
        success: true,
        updatedReportCard,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingReportCard,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
  async createSubject(createSubjectReq: createSubjectReq) {
    const { type, learningPackageId } = createSubjectReq;
    let subjectCreated: Subject, foundLearningPackageId: LearningPackage;
    try {
      foundLearningPackageId = await this.learningPackageRepo.findOne({
        where: {
          id: learningPackageId,
        },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingLearningPackage + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundLearningPackageId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchLearningPackage,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      subjectCreated = await this.subjectRepo.save({
        type,
        learningPackage: foundLearningPackageId,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.saveSubject + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      subjectCreated,
      success: true,
    };
  }

  async updateChapterProfile(id: string, updateChapterReq: updateChapterReq) {
    const { type } = updateChapterReq;
    let foundChapter, updatedChapter: Chapter;

    try {
      foundChapter = await this.chapterRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingChapter + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundChapter) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.chapterNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedChapter = await this.chapterRepo.save({
        ...foundChapter,
        type: type ?? foundChapter.type,
      });

      return {
        success: true,
        updatedChapter,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingChapter,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async updateSetting(id: string, updateSettingReq: updateSettingReq) {
    const { type } = updateSettingReq;
    let foundSetting, updatedSetting: Settings;

    try {
      foundSetting = await this.settingRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.checkingSetting + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundSetting) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.settingNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedSetting = await this.settingRepo.save({
        ...foundSetting,
        type: type ?? foundSetting.type,
      });

      return {
        success: true,
        updatedSetting,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.updatingSetting,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getUserSetting(
    id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Settings>> {
    let results, total;

    try {
      results = await this.settingRepo.createQueryBuilder('Setting');
      if (id != null) {
        results.where('id = :id', { id });
      }
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchSetting + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return paginate<Settings>(results, options);
  }

  async BulkRegistration(file) {
    const filepath = file.path;
    const excelData = excelToJSON({
      sourceFile: filepath,
      header: {
        rows: 1,
      },
      columnToKey: {
        '*': '{{columnHeader}}',
      },
    });
    let regResp;
    let createdUser;
    let successFileCreated;
    let errorFileCreated;
    try {
      const originalKeys = [
        'firstName',
        'lastName',
        'phoneNumber',
        'email',
        'password',
        'deviceId',
        'countryId',
        'address',
      ];
      let flag;
      const date = new Date();
      const current_date =
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      const current_time =
        date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
      const successFileName =
        'registered_' + current_date + '_Time_' + current_time + '.csv';
      const errorFileName =
        'not_registered_' + current_date + '_Time_' + current_time + '.csv';
      successFileCreated = fs.createWriteStream(successFileName);
      errorFileCreated = fs.createWriteStream(errorFileName);
      const excelKeys = Object.keys(excelData.Data[0]);
      // get the missing column
      for (let i = 0; i < originalKeys.length; i++) {
        for (let k = 0; k < excelKeys.length; k++) {
          if (originalKeys[i] == excelKeys[k]) {
            flag = 1;
            successFileCreated.write(excelKeys[k] + ' ');
            errorFileCreated.write(excelKeys[k] + ' ');
            break;
          } else {
            flag = 0;
          }
        }
        if (flag == 0) {
          throw new HttpException(
            {
              status: HttpStatus.NO_CONTENT,
              error: `Column missing (${originalKeys[i]}) `,
            },
            HttpStatus.NO_CONTENT,
          );
        }
      }
      errorFileCreated.write('remarks');
      for (let i = 0; i < excelData.Data.length; i++) {
        try {
          regResp = await this.authService.registerUser({
            firstName: excelData.Data[i].firstName,
            lastName: excelData.Data[i].lastName,
            email: excelData.Data[i].email,
            phoneNumber: excelData.Data[i].phoneNumber,
            password: excelData.Data[i].password,
            confirmPassword: excelData.Data[i].password,
            countryId: excelData.Data[i].countryId,
          });
          const csv = Object.values(excelData.Data[i]).toString();
          successFileCreated.write('\n' + csv + '\n');
        } catch (e) {
          excelData.Data[i].remark = e.response.error;
          const csv = Object.values(excelData.Data[i]).toString();
          errorFileCreated.write('\n' + csv + '\n');
        }
      }

      // createdUser = await Promise.all(
      //   excelData.Data.map(async (user: any) => {
      //     regResp = await this.authService.registerUser({
      //       firstName: user.firstName,
      //       lastName: user.lastName,
      //       email: user.email,
      //       phoneNumber: user.phoneNumber,
      //       password: user.password,
      //       confirmPassword: user.password,
      //       countryId: user.countryId,
      //     });
      //     return regResp.createdUser;
      //   }),
      // )
      //   .then((seededUsers: User[]) => {
      //     for (let i = 0; i < excelData.Data.length; i++) {
      //       excelData.Data[i].remark = 'Inserted';
      //     }
      //   })
      //   .catch((reject) => {
      //     for (let i = 0; i < excelData.Data.length; i++) {
      //       excelData.Data[i].remark = 'Not Inserted';
      //     }
      //   });

      errorFileCreated.end();
      successFileCreated.end();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: err,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      createdUser,
      success: true,
      successFile: successFileCreated.path,
      errorFile: errorFileCreated.path,
    };
  }
}
