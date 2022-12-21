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
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
var moment = require('moment');

import {
  createLessonReq,
  createChapterReq,
  createSubjectReq,
  updateChapterReq,
  updateLessonReq,
  updateSubjectReq,
  createTestReq,
  updateTestReq,
  createReportCardReq,
  updateReportCardReq,
  updateLeaderboardReq,
  createBadgeReq,
  updateBadgeReq,
  createMockTestReq,
  updateMockTestReq,
} from 'src/dto/content.dto';
import { Lesson } from 'src/entities/lesson.entity';
import {
  adminErrors,
  adminMessages,
  contentMessages,
  contentErrors,
} from 'src/constants';
import { Chapter } from 'src/entities/chapter.entity';
import { Subject } from 'src/entities/subject.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import { Test } from 'src/entities/test.entity';
import { ReportCard } from 'src/entities/reportCard.entity';
import { Leaderboard } from 'src/entities/leaderboard.entity';
import { Badge } from 'src/entities/badges.entity';
import { MockTest } from 'src/entities/mockTest.entity';
import { Class } from 'src/entities/class.entity';
config();
const { BCRYPT_SALT } = process.env;

@Injectable()
export class ContentService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Chapter) private chapterRepo: Repository<Chapter>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(LearningPackage)
    private learningPackageRepo: Repository<LearningPackage>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(ReportCard)
    private reportCardRepo: Repository<ReportCard>,
    @InjectRepository(Leaderboard)
    private leaderboardRepo: Repository<Leaderboard>,
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
    @InjectRepository(MockTest) private mockTestRepo: Repository<MockTest>,
    @InjectRepository(Class) private classRepo: Repository<Class>, // @InjectRepository(Parent) private parentRepo: Repository<Parent>,
  ) // @InjectRepository(User) private userRepo: Repository<User>,
  // @InjectRepository(Session) private sessionRepo: Repository<Session>,
  // @InjectRepository(Student) private studentRepo: Repository<Student>,

  {}

  // async formatPayload(user: any, type: string) {
  //   switch (type) {
  //     case UserTypes.DEFAULT:
  //       delete user?.createdAt;
  //       delete user?.updatedAt;
  //       delete user?.parent?.id;
  //       delete user?.parent?.createdAt;
  //       delete user?.parent?.updatedAt;
  //       delete user?.parent?.password;
  //       delete user?.parent?.passwordResetPin;
  //       break;
  //     case UserTypes.CUSTOMERCARE:
  //       delete user?.password;
  //       delete user?.passwordResetPin;
  //       delete user?.onboardingStage;
  //       break;

  //     default:
  //       break;
  //   }

  //   return user;
  // }

  //async getChapters(user: GetAllUsersSessionsReq) {
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
  //}
  async getChapters(options: IPaginationOptions): Promise<Pagination<Chapter>> {
    let foundChapters;
    try {
      foundChapters = await this.chapterRepo.createQueryBuilder('Chapter');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchChapter + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Chapter>(foundChapters, options);
  }
  async getLessons(options: IPaginationOptions): Promise<Pagination<Lesson>> {
    let foundLessons;
    try {
      foundLessons = await this.lessonRepo.createQueryBuilder('Lesson');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchLessons + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Lesson>(foundLessons, options);
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
          error: contentErrors.checkingChapter + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundChapterId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchSubjectById,
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
          error: contentErrors.saveLesson + e,
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
          error: contentErrors.checkingSubject + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundSubjectId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchSubjectById,
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
          error: contentErrors.saveChapter + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      chapterCreated,
      success: true,
    };
  }

  async updateChapterProfile(id: string, updateChapterReq: updateChapterReq) {
    const { type } = updateChapterReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundChapter, updatedChapter: Chapter;

    try {
      foundChapter = await this.chapterRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingChapter + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundChapter) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.chapterNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedChapter = await this.chapterRepo.save({
        ...foundChapter,
        type: type ?? foundChapter.type,
        updatedAt: date,
      });

      return {
        success: true,
        updatedChapter,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingChapter,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async updateLessonProfile(id: string, updateLessonReq: updateLessonReq) {
    const { type } = updateLessonReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundLesson, updatedLesson: Lesson;

    try {
      foundLesson = await this.lessonRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingLesson + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundLesson) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.lessonNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    try {
      updatedLesson = await this.lessonRepo.save({
        ...foundLesson,
        type: type ?? foundLesson.type,
        updatedAt: date,
      });

      return {
        success: true,
        updatedLesson,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingLesson,
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
          error: contentErrors.checkingLearningPackage + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundLearningPackageId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchLearningPackage,
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
          error: contentErrors.saveSubject + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      subjectCreated,
      success: true,
    };
  }

  async updateSubjectProfile(id: string, updateSubjectReq: updateSubjectReq) {
    const { type } = updateSubjectReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundSubject, updatedSubject: Subject;

    try {
      foundSubject = await this.subjectRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingSubject + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundSubject) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.subjectNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedSubject = await this.subjectRepo.save({
        ...foundSubject,
        type: type ?? foundSubject.type,
        updatedAt: date,
      });

      return {
        success: true,
        updatedSubject,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingSubject,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getSubjects(options: IPaginationOptions) : Promise<Pagination<Subject>> {
    let foundSubjects;
    try {
      foundSubjects = await this.subjectRepo.createQueryBuilder('Subject');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchsubject + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Subject>(foundSubjects, options);
  }

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
          error: contentErrors.checkingLesson + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundLessonId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchLesson,
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
          error: contentErrors.saveTest + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      testCreated,
      success: true,
    };
  }

  async updateTestProfile(id: string, updateTestReq: updateTestReq) {
    const { topic } = updateTestReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundTest, updatedTest: Test;

    try {
      foundTest = await this.testRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundTest) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.testNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedTest = await this.testRepo.save({
        ...foundTest,
        topic: topic ?? foundTest.topic,
        updatedAt: date,
      });

      return {
        success: true,
        updatedTest,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingTest,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getTests(options: IPaginationOptions) : Promise<Pagination<Test>> {
    let foundTests;
    try {
      foundTests = await this.testRepo.createQueryBuilder('Test');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Test>(foundTests, options);
  }

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
          error: contentErrors.failedToFetchStudents + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundStudentId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToStudent,
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
          error: contentErrors.checkingTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundTestId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchTest,
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
          error: contentErrors.checkingLesson + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundLessonId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchLesson,
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
          error: contentErrors.checkingSubject + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    if (!foundSubjectId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchSubjectById,
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
          error: contentErrors.saveReportCard + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      reportCardCreated,
      success: true,
    };
  }

  async updateReportCardProfile(
    id: string,
    updateReportCardReq: updateReportCardReq,
  ) {
    const { remark } = updateReportCardReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundReoprtCard, updatedReportCard: ReportCard;

    try {
      foundReoprtCard = await this.reportCardRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingReportCard + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundReoprtCard) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.reportCardNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedReportCard = await this.reportCardRepo.save({
        ...foundReoprtCard,
        remark: remark ?? foundReoprtCard.remark,
        updatedAt: date,
      });

      return {
        success: true,
        updatedReportCard,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingReportCard,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getReportCard(options: IPaginationOptions): Promise<Pagination<ReportCard>> {
    let foundReportCards;
    try {
      foundReportCards = await this.reportCardRepo.createQueryBuilder('ReportCard');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchReportCard + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<ReportCard>(foundReportCards, options);
  }

  async updateLeaderboardProfile(
    id: string,
    updateLeaderboardReq: updateLeaderboardReq,
  ) {
    const { points } = updateLeaderboardReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundLeaderboard, updatedLeaderboard: Leaderboard;

    try {
      foundLeaderboard = await this.leaderboardRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingLeaderboard + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundLeaderboard) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.leaderboardNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedLeaderboard = await this.leaderboardRepo.save({
        ...foundLeaderboard,
        points: points ?? foundLeaderboard.points,
        updatedAt: date,
      });

      return {
        success: true,
        updatedLeaderboard,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingLeaderboard,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getLeaderboard(options: IPaginationOptions): Promise<Pagination<Leaderboard>> {
    let foundLeaderboards;
    try {
      foundLeaderboards = await this.leaderboardRepo.createQueryBuilder('Leaderboard');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchLeaderboard + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Leaderboard>(foundLeaderboards, options);
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
          error: contentErrors.saveBadge + e,
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
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundBadge, updatedBadge: Badge;

    try {
      foundBadge = await this.badgeRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingBadge + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundBadge) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.badgeNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedBadge = await this.badgeRepo.save({
        ...foundBadge,
        badgeName: badgeName ?? foundBadge.badgeName,
        updatedAt: date,
      });

      return {
        success: true,
        updatedBadge,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingBadge,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getBadge(options: IPaginationOptions) : Promise<Pagination<Badge>>{
    let foundBadges;
    try {
      foundBadges = await this.badgeRepo.createQueryBuilder('Badge');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchBadge + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Badge>(foundBadges, options);;
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
          error: contentErrors.saveMockTest + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      mockTestCreated,
      success: true,
    };
  }

  async updateMockTestProfile(
    id: string,
    updateMockTestReq: updateMockTestReq,
  ) {
    const { mockTestName } = updateMockTestReq;
    var date = moment().utc().format('YYYY-MM-DD hh:mm:ss');
    let foundMockTest, updatedMockTest: Badge;

    try {
      foundMockTest = await this.mockTestRepo.findOne({
        where: { id },
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.checkingMockTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundMockTest) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.mockTestNotFound,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    try {
      updatedMockTest = await this.mockTestRepo.save({
        ...foundMockTest,
        mockTestName: mockTestName ?? foundMockTest.mockTestName,
        updatedAt: date,
      });

      return {
        success: true,
        updatedMockTest,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.updatingBadge,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getMockTest(options: IPaginationOptions): Promise<Pagination<MockTest>> {
    let foundMockTests;
    try {
      foundMockTests = await this.mockTestRepo.createQueryBuilder('MockTest');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchMockTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<MockTest>(foundMockTests, options);
  }

  async getUpcomingClasses(options: IPaginationOptions): Promise<Pagination<Class>>{
    let foundUpcomingClasses;
    try {
      foundUpcomingClasses = await this.classRepo.createQueryBuilder('Classes');
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchUpcomingClasses + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Class>(foundUpcomingClasses, options);
  }
}
