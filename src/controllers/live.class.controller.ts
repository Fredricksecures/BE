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
import { Request, Response } from 'express';
import { liveClassMessages, liveClassErrors } from 'src/utils/messages';
import { LiveClassService } from 'src/services/live.class.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

//change it to live class
@Controller('liveclass')
export class LiveClassController {
  constructor(private readonly liveClassService: LiveClassService) {}

  @Get('upcoming-classes')
  async getUpcomingClasses(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const upcomingClasses = await this.liveClassService.getUpcomingClasses(
      options,
    );
    resp.json({
      status: HttpStatus.OK,
      message: liveClassMessages.upcomingClassesFetchSuccess,
      upcomingClasses: upcomingClasses.items,
      meta: upcomingClasses.meta,
    });
  }
}
