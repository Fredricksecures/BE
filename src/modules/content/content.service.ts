import { MockTestQuestions } from 'src/modules/admin/entity/mockTestQuestions.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../user/entity/user.entity';
import { GetAllUsersSessionsReq } from '../admin/dto/admin.dto';
import Logger from 'src/utils/logger';
import { Session } from 'src/modules/auth/entity/session.entity';
import { Student } from 'src/modules/user/entity/student.entity';
import { Parent } from 'src/modules/auth/entity/parent.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import {
  updateLeaderboardReq,
  addReviewReq,
  updateMockTestReq,
} from 'src/modules/content/dto/content.dto';
import { Lesson } from 'src/modules/content/entity/lesson.entity';
import { contentErrors, adminErrors } from 'src/utils/messages';
import { Chapter } from 'src/modules/content/entity/chapter.entity';
import { Subject } from 'src/modules/content/entity/subject.entity';
import { LearningPackage } from 'src/modules/utility/entity/learningPackage.entity';
import { Test } from 'src/modules/content/entity/test.entity';
import { ReportCard } from 'src/modules/user/entity/reportCard.entity';
import { Leaderboard } from 'src/modules/content/entity/leaderBoard.entity';
import { Badge } from 'src/modules/user/entity/badges.entity';
import { MockTest } from 'src/modules/admin/entity/mockTest.entity';
import { Class } from 'src/modules/liveClass/entity/class.entity';
import { Review } from 'src/modules/content/entity/review.entity';
import { Material } from './entity/material.entity';

@Injectable()
export class ContentService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Chapter) private chapterRepo: Repository<Chapter>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
    @InjectRepository(MockTestQuestions)
    private mockTestQuestionsRepo: Repository<MockTestQuestions>,
    @InjectRepository(ReportCard)
    private reportCardRepo: Repository<ReportCard>,
    @InjectRepository(Leaderboard)
    private leaderboardRepo: Repository<Leaderboard>,
    @InjectRepository(MockTest) private mockTestRepo: Repository<MockTest>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>, // @InjectRepository(Parent) private parentRepo: Repository<Parent>, // @InjectRepository(User) private userRepo: Repository<User>, // @InjectRepository(Session) private sessionRepo: Repository<Session>, // @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  async getChapters(
    subjectId,
    options: IPaginationOptions,
  ): Promise<Pagination<Chapter>> {
    let foundChapters;
    try {
      foundChapters = this.chapterRepo.createQueryBuilder('Chapter');
      if (subjectId) {
        foundChapters = foundChapters.where('Chapter.subjectId = :subjectId', {
          subjectId,
        });
      }
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

  // async addQuestions(options: IPaginationOptions): Promise<Pagination<Chapter>> {
  //   let foundChapters;
  //   try {
  //     foundChapters = await this.chapterRepo.createQueryBuilder('Chapter');
  //   } catch (exp) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_IMPLEMENTED,
  //         error: contentErrors.failedToFetchChapter + exp,
  //       },
  //       HttpStatus.NOT_IMPLEMENTED,
  //     );
  //   }
  //   return paginate<Chapter>(foundChapters, options);
  // }

  async getLessons(
    chapterId,
    options: IPaginationOptions,
  ): Promise<Pagination<Lesson>> {
    let foundLessons;

    // try {
    //   foundLessons = this.lessonRepo
    //     .createQueryBuilder('Lesson')
    //   // .leftJoinAndSelect('lesson.materials', 'Material');

    //   if (chapterId) {
    //     foundLessons = foundLessons.where('Lesson.chapterId = :chapterId', {
    //       chapterId,
    //     });
    //   }
    // } catch (exp) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_IMPLEMENTED,
    //       error: adminErrors.failedToFetchLessons + exp,
    //     },
    //     HttpStatus.NOT_IMPLEMENTED,
    //   );
    // }
    // return paginate<Lesson>(foundLessons, options);

    try {
      foundLessons = await this.lessonRepo.find({
        where: {
          chapter: { id: chapterId },
        },
        relations: ['materials'],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: adminErrors.failedToFetchLessons + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return foundLessons;
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
      foundMockTests.select([
        'MockTest.id',
        'MockTest.name',
        'MockTest.image',
        'MockTest.subjects',
        'MockTest.minutes',
        'MockTest.questions',
      ]);
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

  async getMockTestDetails(id: string) {
    let data;
    try {
      data = await this.mockTestRepo.findOneBy({ id });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchMockTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      data,
      success: true,
    };
  }

  async getMockTestQuestions(id: string) {
    let data;
    try {
      data = await this.mockTestQuestionsRepo.find({
        where: { mock_test: { id } },
        select: [
          'id',
          'question',
          'option_a',
          'option_b',
          'option_c',
          'option_d',
        ],
      });
    } catch (exp) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: contentErrors.failedToFetchMockTest + exp,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    return {
      data,
      success: true,
    };
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
        review:lessonReview,
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
   
    try {
      foundReviews =
        id == undefined
          ? await this.reviewRepo.createQueryBuilder('Review')
          : await this.reviewRepo
              .createQueryBuilder('Review')
              .where('Review.lesson.id = :id', { id });
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
    const { name, subject } = updateMockTestReq;

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
        name: name ?? foundMockTest.name,
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
