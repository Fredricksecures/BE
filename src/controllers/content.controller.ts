import {
  Query,
  Controller,
  HttpStatus,
  Res,
  Get,
  Req,
  HttpException,
} from '@nestjs/common';
import {
  GetAllUsersSessionsReq,
  GetAllUsersSessionsRes,
} from 'src/dto/admin.dto';
import { Request, Response } from 'express';
import { adminErrors, adminMessages } from 'src/constants';
import { ContentService } from 'src/services/content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('subjects')
  async getSubjects(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: GetAllUsersSessionsReq,
  ) {
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
  }

  @Get('chapters')
  async getChapters(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: GetAllUsersSessionsReq,
  ) {}

  @Get('lessons')
  async getLessons(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: GetAllUsersSessionsReq,
  ) {}
}
