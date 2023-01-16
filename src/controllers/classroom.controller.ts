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
import { classroomMessages, classroomErrors } from 'src/utils/messages';
import { ClassroomService } from 'src/services/classroom.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get('upcoming-classes')
  async getUpcomingClasses(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = { limit, page };
    const upcomingClasses = await this.classroomService.getUpcomingClasses(
      options,
    );
    resp.json({
      status: HttpStatus.OK,
      message: classroomMessages.upcomingClassesFetchSuccess,
      upcomingClasses: upcomingClasses.items,
      meta: upcomingClasses.meta,
    });
  }
}
