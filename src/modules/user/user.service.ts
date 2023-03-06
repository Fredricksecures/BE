import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import {
  CreateStudentReq,
  UpdateStudentReq,
  GetStudentReq,
  GetStudentRes,
  CreateStudentRes,
  CreateParentReq,
  UpdateParentReq,
  mockTestResultReq,
  CreateLearningJourneyReq
} from './dto/user.dto';
import { Student } from 'src/modules/user/entity/student.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import { userErrors, utilityErrors } from 'src/utils/messages';
import Logger from 'src/utils/logger';
import { UserTypes, Genders } from 'src/utils/enums';
import { UtilityService } from '../utility/utility.service';
import { CountryList } from 'src/modules/utility/entity/countryList.entity';
import { LearningPackage } from 'src/modules/utility/entity/learningPackage.entity';
import { Subscription } from 'src/modules/subscription/entity/subscription.entity';
import { MockTestResult } from 'src/modules/user/entity/mockTestresult.entity';
import { MockTestQuestions } from 'src/modules/admin/entity/mockTestQuestions.entity';
import { LearningJourney } from './entity/learningJourney.entity';
import { Lesson } from '../content/entity/lesson.entity';
import { Chapter } from '../content/entity/chapter.entity';
import { Subject } from '../content/entity/subject.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Badge } from 'src/modules/user/entity/badges.entity';
import { isEmpty } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(MockTestQuestions)
    private mockTestQuestionsRepo: Repository<MockTestQuestions>,
    @InjectRepository(MockTestResult)
    private mockTestResultRepo: Repository<MockTestResult>,

    private jwtService: JwtService,
    private readonly utilityService: UtilityService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Parent) private parentRepo: Repository<Parent>,
    @InjectRepository(LearningPackage)
    private packageRepo: Repository<LearningPackage>,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
    @InjectRepository(LearningJourney)
    private lJRepo: Repository<LearningJourney>,
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
    @InjectRepository(Chapter)
    private chapterRepo: Repository<Chapter>,
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
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

    if (!country) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: utilityErrors.invalidCountry,
        },
        HttpStatus.NOT_FOUND,
      );
    }

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

  async getBadge(
    id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Badge>> {
    let foundBadges;

    try {
      foundBadges =
        id == undefined
          ? await this.badgeRepo.createQueryBuilder('Badge')
          : await this.badgeRepo
              .createQueryBuilder('Badge')
              .where('Badge.id = :id', { id });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: userErrors.failedToFetchBadge + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Badge>(foundBadges, options);
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

  // async getStudents(student_id,getStudentReq: GetStudentReq): Promise<GetStudentRes> {
  //   const { parentId, user } = getStudentReq;

  //   let foundStudents: Student | Array<Student>;
  //   if(student_id)
  //   {
  //       foundStudents = await this.studentRepo.find({
  //         where: { id: student_id },
  //         relations: ['parent'],
  //       });
  //   }
  //   else
  //   {
  //     foundStudents = await this.studentRepo.find({
  //       where: { parent: {id: user.parent.id }},
  //       relations: ['parent'],
  //     });
  // }
    
  //   //const parent = await this.getParentDetails(user.id, ['students']);

  //   if (!foundStudents) {
  //     Logger.error(userErrors.studentsNotFound).console();

  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_IMPLEMENTED,
  //         error: userErrors.studentsNotFound,
  //       },
  //       HttpStatus.NOT_IMPLEMENTED,
  //     );
  //   }

  //   return {
  //     success: true,
  //     students: foundStudents,
  //   };
  // }
  async getStudents(getStudentReq: GetStudentReq): Promise<GetStudentRes> {
    const { studentId, user } = getStudentReq;

    // let parent: Parent, student: User, students: Array<User>;
    let parent: Parent, student, students;

    if (!isEmpty(studentId)) {
      try {
        student = await this.userRepo.findOne({
          where: {
            id: studentId,
            parent: { id: user.parent.id },
          },
         // relations: ['student'],
          relations: [
            'student',
            'student.learningJournies',
            'student.learningJournies.subject',
          ],
        });
      } catch (exp) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: 'not student with matching id found',
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (!student) {
        Logger.error(userErrors.studentNotFound).console();

        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: userErrors.studentNotFound,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        students: student,
      };
    } else {
      // parent = await this.getParentDetails(user, ['students']);

      students = await this.userRepo.find({
        where: {
          student: { parent: { id: user.parent.id } },
        },
       // relations: ['student'],
        relations: [
          'student',
          'student.learningJournies',
          'student.learningJournies.subject',
        ],
      });

      if (!students) {
        Logger.error(userErrors.studentsNotFound).console();

        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: userErrors.studentsNotFound,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        students,
      };
    }
  }

  async updateStudentProfile(updateStudentReq: UpdateStudentReq) {
    const { id, points } = updateStudentReq;

    let foundUser: Student;
    try {
      foundUser = await this.studentRepo.findOne({
        where: {
          id,
        },
      });
      console.log(foundUser)
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
        ...foundUser[0],
        points: points ?? foundUser[0].points,
        // dateOfBirth: dateOfBirth || foundUser.dateOfBirth,
        //parent: foundUser.parent,
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

    let foundUser: User, updatedParent: Parent;
    try {
      console.log(user)
      foundUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: ['parent'],
      });
      console.log(foundUser)
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

  async getMockTestResult(mockTestResultReq: mockTestResultReq) {
    const { studentID, mockTestID, totalQuestions, totalTime } =
      mockTestResultReq;
    let totalMarks = 0,
      addMockTestResult,totalMarksPercentage,totalTimePercentage;
    var count = 0;
    try {
      let total = await this.mockTestQuestionsRepo.find({
        where: {
          mock_test: {
            id: mockTestID,
          },
        },
        relations: ['mock_test'],
      });
     
      totalQuestions.forEach(async (data) => {
        let foundQuestion = await this.mockTestQuestionsRepo.findOne({
          where: { id: data.id },
        });
        if (foundQuestion.correct_answer == data.answer) {
          totalMarks = totalMarks + 1;
        }
      });

       totalMarksPercentage = (totalMarks / total.length) * 100;
       totalTimePercentage = (totalTime / 35) * 100;
      addMockTestResult = await this.mockTestResultRepo.save({
        studentID: studentID,
        mockTestID: mockTestID,
        totalPercentage: totalMarksPercentage,
        totalTime: totalTimePercentage,
      });

      return {
        success: true,
        addMockTestResult,
      };
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: userErrors.failToGetResult + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    //return paginate<Badge>(foundBadges, options);
  }

  async startLearningJourney(payload: CreateLearningJourneyReq) {
    const { studentId, lessonId, subjectId, chapterId } = payload;

    let foundUser: User,
      newJourney: LearningJourney,
      foundContent: Lesson | Subject | Chapter;

    try {
      foundUser = await this.userRepo.findOne({
        where: { id: studentId },
        relations: ['student'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: userErrors.updatingStudent + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: userErrors.studentNotFound,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let colKey: string = '';

    if (lessonId) {
      colKey = 'lesson';
      foundContent = await this.lessonRepo.findOne({
        where: { id: lessonId },
      });
    }

    if (chapterId) {
      colKey = 'chapter';
      foundContent = await this.chapterRepo.findOne({
        where: { id: chapterId },
      });
    }

    if (subjectId) {
      colKey = 'subject';
      foundContent = await this.subjectRepo.findOne({
        where: { id: subjectId },
      });
    }

    try {
      newJourney = await this.lJRepo.save({
        student: foundUser.student,
        subject: await this.subjectRepo.findOne({
          where: { id: subjectId },
          [`${colKey}`]: foundContent,
        }),
      });

      // updatedStudent = await this.studentRepo.save({
      //   { ...foundUser.student,
      //   email: email ?? foundUser.parent.email,
      //   phoneNumber: phoneNumber ?? foundUser.parent.phoneNumber,
      //   address: address ?? foundUser.parent.address,
      // });

      return {
        success: true,
        newJourney,
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
}
