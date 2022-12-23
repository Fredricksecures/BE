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
  createSubjectReq,
  updateChapterReq,
  
  updateLeaderboardReq,
} from 'src/dto/content.dto';
import { Lesson } from 'src/entities/lesson.entity';
import { contentErrors,adminErrors } from 'src/utils/messages';
import { Chapter } from 'src/entities/chapter.entity';
import { Subject } from 'src/entities/subject.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import { Test } from 'src/entities/test.entity';
import { ReportCard } from 'src/entities/reportCard.entity';
import { Leaderboard } from 'src/entities/leaderboard.entity';
import { Badge } from 'src/entities/badges.entity';
import { MockTest } from 'src/entities/mockTest.entity';
import { Class } from 'src/entities/class.entity';

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
    @InjectRepository(ReportCard)private reportCardRepo: Repository<ReportCard>,
    @InjectRepository(Leaderboard)
    private leaderboardRepo: Repository<Leaderboard>,
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
    @InjectRepository(MockTest) private mockTestRepo: Repository<MockTest>,
    @InjectRepository(Class) private classRepo: Repository<Class>, // @InjectRepository(Parent) private parentRepo: Repository<Parent>, // @InjectRepository(User) private userRepo: Repository<User>, // @InjectRepository(Session) private sessionRepo: Repository<Session>, // @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

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
          error: adminErrors.failedToFetchLessons + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Lesson>(foundLessons, options);
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

  
  async getSubjects(options: IPaginationOptions): Promise<Pagination<Subject>> {
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

  

  async getTests(options: IPaginationOptions): Promise<Pagination<Test>> {
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

  
  async getReportCard(
    options: IPaginationOptions,
  ): Promise<Pagination<ReportCard>> {
    let foundReportCards;
    try {
      foundReportCards = await this.reportCardRepo.createQueryBuilder(
        'ReportCard',
      );
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

  async getLeaderboard(
    options: IPaginationOptions,
  ): Promise<Pagination<Leaderboard>> {
    let foundLeaderboards;
    try {
      foundLeaderboards = await this.leaderboardRepo.createQueryBuilder(
        'Leaderboard',
      );
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

  
 
  async getBadge(options: IPaginationOptions): Promise<Pagination<Badge>> {
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
    return paginate<Badge>(foundBadges, options);
  }

  
  async getMockTest(
    options: IPaginationOptions,
  ): Promise<Pagination<MockTest>> {
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

  
}
