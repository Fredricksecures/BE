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
} from '@nestjs/common';
import {
  GetAllUsersSessionsReq,
  GetAllUsersSessionsRes,
} from 'src/dto/admin.dto';
import{ 
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
  updateMockTestReq
 } from 'src/dto/content.dto';
import { Request, Response } from 'express';
import { adminErrors, adminMessages,contentMessages,contentErrors } from 'src/constants';
import { ContentService } from 'src/services/content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // @Get('subjects')
  // async getSubjects(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) resp: Response,
  //   @Query() query: GetAllUsersSessionsReq,
  // ) {
    // const { success, sessions }: GetAllUsersSessionsRes =
    //   await this.contentService.getUserSessions(query);
    // if (success) {
    //   resp.json({
    //     status: HttpStatus.OK,
    //     message: adminMessages.fetchSessionSuccess,
    //     sessions,
    //   });
    // } else {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_FOUND,
    //       error: adminErrors.fetchSessionFailed,
    //     },
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
 // }

  @Get('chapters')
  async getChapters(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response
  ) {
    const chapters = await this.contentService.getChapters();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.chaptersFetchSuccess, 
      chapters,
    });
  }

  @Get('lessons')
  async getLessons(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const lessons = await this.contentService.getLessons();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.lessonsFetchSuccess, 
      lessons,
    });
  }
  
  @Post('create-lesson')
  async createLesson(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createLessonReq,
  ) {
    const { success, lessonCreated } =
      await this.contentService.createLesson(body);

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
    const { success, subjectCreated } =
      await this.contentService.createSubject(body);

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
    
    const { success, chapterCreated } =
      await this.contentService.createChapter(body);

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
    let { updatedChapter, success }=
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
    let { updatedLesson, success }=
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
    let { updatedSubject, success }=
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
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const subjects = await this.contentService.getSubjects();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.subjectFetchSuccess, 
      subjects,
    });
  }

  @Post('create-test')
  async createTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createTestReq,
  ) {
    
    const { success, testCreated } =
      await this.contentService.createTest(body);

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
    let { updatedTest, success }=
      await this.contentService.updateTestProfile(id, {
        ...req.body,
      });

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
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const tests = await this.contentService.getTests();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.testFetchSuccess, 
      tests,
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
    let { updatedReportCard, success }=
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

  @Get('reportCards')
  async getReportCards(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const tests = await this.contentService.getReportCard();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.reportCardFetchSuccess, 
      tests,
    });
  }
 
  @Patch('update-leaderboard/:id')
  async updateLeaderboard(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateLeaderboardReq,
    @Param('id') id,
  ) {
    let { updatedLeaderboard, success }=
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

  @Get('leaderboards')
  async getLeaderboards(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const tests = await this.contentService.getLeaderboard();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.leaderboardFetchSuccess, 
      tests,
    });
  }
  @Post('create-badge')
  async createBadge(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: createBadgeReq,
  ) {
    
    const { success, badgeCreated } =
      await this.contentService.createBadge(body);

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
    let { updatedBadge, success }=
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
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const tests = await this.contentService.getBadge();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.badgeFetchSuccess, 
      tests,
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
    let { updatedMockTest, success }=
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
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const tests = await this.contentService.getMockTest();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.mockTestFetchSuccess, 
      tests,
    });
  }
  @Get('upcoming-classes')
  async getUpcomingClasses(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response
   
  ) {
    const tests = await this.contentService.getUpcomingClasses();
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.upcomingClassesFetchSuccess, 
      tests,
    });
  }
}
