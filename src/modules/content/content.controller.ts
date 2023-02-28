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
import { updateMockTestReq } from '../admin/dto/admin.dto';
import {
  updateLeaderboardReq,
  addReviewReq,
} from 'src/modules/content/dto/content.dto';
import { Request, Response } from 'express';
import { contentMessages, contentErrors } from 'src/utils/messages';
import { ContentService } from 'src/modules/content/content.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('chapters')
  async getChapters(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
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

  @Get('subjects')
  async getSubjects(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
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

  @Get('tests')
  async getTests(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
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

  @Get('report-cards')
  async getReportCards(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
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
    const { updatedLeaderboard, success } =
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
    @Query('id') id,
  ) {
    const options: IPaginationOptions = { limit, page };
    const tests = await this.contentService.getLeaderboard(id, options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.leaderboardFetchSuccess,
      tests: tests.items,
      meta: tests.meta,
    });
  }

  @Get('mockTests')
  async getMockTests(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
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

  @Get('mock-test-details/:id')
  async getMockTestDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('id') id: string,
  ) {
    const { success, data } = await this.contentService.getMockTestDetails(id);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.mockTestFetchSuccess,
        data,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.checkingMockTest,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('add-review')
  async addReview(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: addReviewReq,
  ) {
    const { success, reviewCreated } = await this.contentService.addReview(
      body,
    );

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: contentMessages.addReviewSuccess,
        reviewCreated,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: contentErrors.failToaddReview,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('reviews')
  async getReviews(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
    @Query('id') id,
  ) {
    const options: IPaginationOptions = { limit, page };
    const reviews = await this.contentService.getReviews(id, options);
    resp.json({
      status: HttpStatus.OK,
      message: contentMessages.reviewsFetchSuccess,
      reviews: reviews.items,
      meta: reviews.meta,
    });
  }

  @Patch('update-mockTest/:id')
  async updateMockTest(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: updateMockTestReq,
    @Param('id') id,
  ) {
    const { updatedMockTest, success } =
      await this.contentService.updateMockTest(id, {
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
}
