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

import {
  updateLeaderboardReq,
  addReviewReq,
  updateMockTestReq,
} from 'src/dto/content.dto';
import { Lesson } from 'src/entities/lesson.entity';
import { contentErrors, adminErrors } from 'src/utils/messages';
import { Chapter } from 'src/entities/chapter.entity';
import { Subject } from 'src/entities/subject.entity';
import { LearningPackage } from 'src/entities/learningPackage.entity';
import { Test } from 'src/entities/test.entity';
import { ReportCard } from 'src/entities/reportCard.entity';
import { Leaderboard } from 'src/entities/leaderboard.entity';
import { Badge } from 'src/entities/badges.entity';
import { MockTest } from 'src/entities/mockTest.entity';
import { Class } from 'src/entities/class.entity';
import { Review } from 'src/entities/review.entity';

@Injectable()
export class ContentService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Chapter) private chapterRepo: Repository<Chapter>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
    @InjectRepository(ReportCard)
    private reportCardRepo: Repository<ReportCard>,
    @InjectRepository(Leaderboard)
    private leaderboardRepo: Repository<Leaderboard>,
    @InjectRepository(MockTest) private mockTestRepo: Repository<MockTest>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>, // @InjectRepository(Parent) private parentRepo: Repository<Parent>, // @InjectRepository(User) private userRepo: Repository<User>, // @InjectRepository(Session) private sessionRepo: Repository<Session>, // @InjectRepository(Student) private studentRepo: Repository<Student>,
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
    id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Leaderboard>> {
    let foundLeaderboards;

    //:
    // try {
    //   foundLeaderboards =
    //     id == undefined
    //       ? await this.leaderboardRepo.createQueryBuilder('Leaderboard')
    //       : await this.badgeRepo
    //           .createQueryBuilder('Leaderboard')
    //           .where('Leaderboard.id = :id', { id });
    // } catch (exp) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: contentErrors.failedToFetchLeaderboard + exp,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }

    return paginate<Leaderboard>(foundLeaderboards, options);
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

  async addReview(addReviewReq: addReviewReq) {
    const { lessonReview, lessonId } = addReviewReq;
    let reviewCreated: Review, foundLessonId: Lesson;
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
      reviewCreated = await this.reviewRepo.save({
        lessonReview,
        lesson: foundLessonId,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.saveReview + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return {
      reviewCreated,
      success: true,
    };
  }

  async getReviews(
    id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Badge>> {
    let foundReviews;
    console.log(id);
    try {
      foundReviews =
        id == undefined
          ? await this.reviewRepo.createQueryBuilder('Review')
          : await this.reviewRepo
              .createQueryBuilder('Review')
              .where('Review.id = :id', { id });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchReview + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return paginate<Badge>(foundReviews, options);
  }

  async updateMockTest(id: string, updateMockTestReq: updateMockTestReq) {
    const { mockTestName, subject } = updateMockTestReq;

    let foundMockTest, updatedMockTest: MockTest;

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
      updatedMockTest = await this.leaderboardRepo.save({
        ...foundMockTest,
        mockTestName: mockTestName ?? foundMockTest.mockTestName,
        subject: subject ?? foundMockTest.subject,
      });

      return {
        success: true,
        updatedMockTest,
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
}
