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
    IPaginationOptions,
    paginate,
    Pagination,
  } from 'nestjs-typeorm-paginate';
  import {
    CreateStudentReq,
    UpdateStudentReq,
    GetStudentReq,
    GetStudentRes,
    CreateStudentRes,
    CreateParentReq,
    UpdateParentReq
  } from '../dto/user.dto';
  import { Student } from 'src/entities/student.entity';
  import { Parent } from 'src/entities/parent.entity';
  import { Device } from 'src/entities/device.entity';
  import { userErrors, subscriptionError } from 'src/utils/messages';
  import Logger from 'src/utils/logger';
  import * as bcrypt from 'bcrypt';
  import { Session } from 'src/entities/session.entity';
  import { UserTypes, Genders } from 'src/utils/enums';
  import { UtilityService } from './utility.service';
  import { CountryList } from 'src/entities/countryList.entity';
  import { LearningPackage } from 'src/entities/learningPackage.entity';
  import { Subscription } from 'src/entities/subscription.entity';

  config();
  const { BCRYPT_SALT } = process.env;
  
  @Injectable()
  export class UserService {
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
    ) {}
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
          Logger.error(userErrors.checkingStudent + exp).console();
    
          throw new HttpException(
            {
              status: HttpStatus.NOT_IMPLEMENTED,
              error: userErrors.queryingParent + exp,
            },
            HttpStatus.NOT_IMPLEMENTED,
          );
        }
    
        if (!foundParent) {
          Logger.error(userErrors.parentNotFound).console();
    
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: userErrors.parentNotFound,
            },
            HttpStatus.NOT_FOUND,
          );
        }
    
        return foundParent;
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
                error: userErrors.noCookieTokenPassed + e,
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
                error: userErrors.noAuthTokenPassed,
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
                error: userErrors.invalidToken + e,
              },
              HttpStatus.UNAUTHORIZED,
            );
          }
        }
    
        if (!decodedId) {
          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              error: userErrors.invalidToken,
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
                error: userErrors.noTokenIdMatch,
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
              error: userErrors.sessionExpired,
            },
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
    
        req.body.user = foundUser;
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
        Logger.error(userErrors.createdParent + e).console();
  
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: userErrors.createdParent + e,
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
    // async getParentDetails(
    //     userId: string,
    //     relations: Array<string>,
    //   ): Promise<Parent> {
    //     let foundParent: Parent;
    
    //     try {
    //       foundParent = await this.parentRepo.findOne({
    //         where: {
    //           user: { id: userId },
    //         },
    //         relations,
    //       });
    //     } catch (exp) {
    //       Logger.error(authErrors.checkingStudent + exp).console();
    
    //       throw new HttpException(
    //         {
    //           status: HttpStatus.NOT_IMPLEMENTED,
    //           error: authErrors.queryingParent + exp,
    //         },
    //         HttpStatus.NOT_IMPLEMENTED,
    //       );
    //     }
    
    //     if (!foundParent) {
    //       Logger.error(authErrors.parentNotFound).console();
    
    //       throw new HttpException(
    //         {
    //           status: HttpStatus.NOT_FOUND,
    //           error: authErrors.parentNotFound,
    //         },
    //         HttpStatus.NOT_FOUND,
    //       );
    //     }
    
    //     return foundParent;
    //   }
    
    async getStudents(getStudentReq: GetStudentReq): Promise<GetStudentRes> {
      const { studentId, user } = getStudentReq;
  
      let foundStudents: Student | Array<Student>;
  
      let parent = await this.getParentDetails(user.id, ['students']);
  
      if (!foundStudents) {
        Logger.error(userErrors.studentsNotFound).console();
  
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: userErrors.studentsNotFound,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
  
      return {
        success: true,
        students: foundStudents,
      };
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
            error: userErrors.checkingStudent + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
      if (!foundUser) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: userErrors.userNotFoundById,
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
            error: userErrors.updatingStudent,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
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
            error: userErrors.checkingParent + exp,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
  
      if (!foundUser) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: userErrors.parentNotFound,
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
            error: userErrors.updatingParent,
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
    }
   
  }
  