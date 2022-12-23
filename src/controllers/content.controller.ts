import {
  Query,
  Controller,
  HttpStatus,
  Res,
  Get,
  Post,
  Req,
  Body,
  Param,
  Patch,
  HttpException,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  GetAllUsersSessionsReq,
  GetAllUsersSessionsRes,
} from 'src/dto/admin.dto';
import {
  createLessonReq,
  createChapterReq,
  updateChapterReq,
  updateLessonReq,
  createSubjectReq,
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
import { Request, Response } from 'express';
import {
  adminErrors,
  adminMessages,
  contentMessages,
  contentErrors,
} from 'src/utils/messages';
import { ContentService } from 'src/services/content.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('chapters')
  async getChapters(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const chapters = await this.contentService.getChapters(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.chaptersFetchSuccess,
      chapters: chapters.items,
      meta: chapters.meta,
    });
  }

  @Get('lessons')
  async getLessons(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const lessons = await this.contentService.getLessons(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.lessonsFetchSuccess,
      lessons: lessons.items,
      meta: lessons.meta,
    });
  }

  @Post('create-lesson')
  async createLesson(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createLessonReq,
  ) {
    const { success, lessonCreated } = await this.contentService.createLesson(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.lessonCreateSuccess,
        lessonCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentMessages.failToCreateLesson,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-subject')
  async createSubject(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createSubjectReq,
  ) {
    const { success, subjectCreated } = await this.contentService.createSubject(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.subjectCreateSuccess,
        subjectCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentMessages.failToCreateSubject,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-chapter')
  async createChapter(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createChapterReq,
  ) {
    const { success, chapterCreated } = await this.contentService.createChapter(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.chapterCreateSuccess,
        chapterCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentMessages.failToCreateLesson,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-chapter/:id')
  async updateChapter(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateChapterReq,
    @Param('id') id,
  ) {
    let { updatedChapter, success } =
      await this.contentService.updateChapterProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedChapterSuccess,
        status: HttpStatus.OK,
        updatedChapter,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingChapterFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-lesson/:id')
  async updateLesson(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateLessonReq,
    @Param('id') id,
  ) {
    let { updatedLesson, success } =
      await this.contentService.updateLessonProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedLessonSuccess,
        status: HttpStatus.OK,
        updatedLesson,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingLessonFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-subject/:id')
  async updateSubject(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateSubjectReq,
    @Param('id') id,
  ) {
    let { updatedSubject, success } =
      await this.contentService.updateSubjectProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedSubjectSuccess,
        status: HttpStatus.OK,
        updatedSubject,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingSubjectFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('subjects')
  async getSubjects(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const subjects = await this.contentService.getSubjects(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.subjectFetchSuccess,
      subjects: subjects.items,
      meta: subjects.meta,
    });
  }

  @Post('create-test')
  async createTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createTestReq,
  ) {
    const { success, testCreated } = await this.contentService.createTest(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.testCreateSuccess,
        testCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentMessages.failToCreateTest,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-test/:id')
  async updateTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateTestReq,
    @Param('id') id,
  ) {
    let { updatedTest, success } = await this.contentService.updateTestProfile(
      id,
      {
        ...req.body,
      },
    );

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedTestSuccess,
        status: HttpStatus.OK,
        updatedTest,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingTestFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('tests')
  async getTests(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const tests = await this.contentService.getTests(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.testFetchSuccess,
      tests: tests.items,
      meta: tests.meta,
    });
  }

  @Post('create-report-card')
  async createReportCard(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createReportCardReq,
  ) {
    const { success, reportCardCreated } =
      await this.contentService.createReportCard(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.reportCardCreateSuccess,
        reportCardCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentMessages.failToCreateReportCard,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-report-card/:id')
  async updateReportCard(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateReportCardReq,
    @Param('id') id,
  ) {
    let { updatedReportCard, success } =
      await this.contentService.updateReportCardProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedReportCardSuccess,
        status: HttpStatus.OK,
        updatedReportCard,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingReportCardFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('report-cards')
  async getReportCards(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const tests = await this.contentService.getReportCard(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.reportCardFetchSuccess,
      tests: tests.items,
      meta: tests.meta,
    });
  }

  @Patch('update-leaderboard/:id')
  async updateLeaderboard(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateLeaderboardReq,
    @Param('id') id,
  ) {
    let { updatedLeaderboard, success } =
      await this.contentService.updateLeaderboardProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedLeaderboardSuccess,
        status: HttpStatus.OK,
        updatedLeaderboard,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingLeaderboardFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('leaderboard')
  async getLeaderboards(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const tests = await this.contentService.getLeaderboard(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.leaderboardFetchSuccess,
      tests: tests.items,
      meta: tests.meta,
    });
  }

  @Post('create-badge')
  async createBadge(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createBadgeReq,
  ) {
    const { success, badgeCreated } = await this.contentService.createBadge(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.badgeCreateSuccess,
        badgeCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentMessages.failToCreateBadge,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-badge/:id')
  async updateBadge(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateBadgeReq,
    @Param('id') id,
  ) {
    let { updatedBadge, success } =
      await this.contentService.updateBadgeProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedBadgeSuccess,
        status: HttpStatus.OK,
        updatedBadge,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingBadgeFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('badges')
  async getBadges(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const badges = await this.contentService.getBadge(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.badgeFetchSuccess,
      badges: badges.items,
      meta: badges.meta,
    });
  }

  @Post('create-mock-test')
  async createMockTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createMockTestReq,
  ) {
    const { success, mockTestCreated } =
      await this.contentService.createMockTest(body);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.mockTestCreateSuccess,
        mockTestCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentMessages.failToCreateMockTest,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-mock-test/:id')
  async updateMockTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateMockTestReq,
    @Param('id') id,
  ) {
    let { updatedMockTest, success } =
      await this.contentService.updateMockTestProfile(id, {
        ...req.body,
      });

    if (success) {
      resp.json({
        success,
        message: contentMessages.updatedMockTestSuccess,
        status: HttpStatus.OK,
        updatedMockTest,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.updatingMockTestFail,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('mockTests')
  async getMockTests(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const mockTests = await this.contentService.getMockTest(options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.mockTestFetchSuccess,
      mockTests: mockTests.items,
      meta: mockTests.meta,
    });
  }

  @Get('upcoming-classes')
  async getUpcomingClasses(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const upcomingClasses = await this.contentService.getUpcomingClasses(
      options,
    );
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.upcomingClassesFetchSuccess,
      upcomingClasses: upcomingClasses.items,
      meta: upcomingClasses.meta,
    });
  }
}
