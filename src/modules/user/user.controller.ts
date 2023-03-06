import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  Get,
  Param,
  HttpException,
  Patch,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  UpdateStudentReq,
  CreateStudentReq,
  BasicUpdateRes,
  mockTestResultReq,
  CreateLearningJourneyReq
} from 'src/modules/user/dto/user.dto';
import { userErrors, userMessages, profileMessages } from 'src/utils/messages';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserTypes } from 'src/utils/enums';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Middleware
  async sessionGuard(req, resp) {
    await this.userService.verifyToken(req, resp, {
      noTimeout: true,
      useCookies: true,
    });
  }

  @Get('badges')
  async getBadges(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query('id') id,
  ) {
    const options: IPaginationOptions = { limit, page };
    const badges = await this.userService.getBadge(id, options);
    resp.json({
      status: HttpStatus.OK,
      message: userMessages.badgeFetchSuccess,
      badges: badges.items,
      meta: badges.meta,
    });
  }

  @Post('create-students')
  @UseMiddleware('sessionGuard')
  async createStudent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: CreateStudentReq,
  ) {
    const { success, createdStudents } =
      await this.userService.createStudentProfile(req.body);

    if (success) {
      resp.json({
        success,
        message: userMessages.createdStudent,
        status: HttpStatus.CREATED,
        students: createdStudents,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: userErrors.createdStudent,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-student')
  @UseMiddleware('sessionGuard')
  async updateStudent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: UpdateStudentReq,
  ) {
    const { user, success } = await this.userService.updateStudentProfile(req.body);

    if (success) {
      resp.json({
        success,
        message: profileMessages.updatedSuccess,
        status: HttpStatus.OK,
        user,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: userErrors.updatingStudent,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // @Get('students')
  // @UseMiddleware('sessionGuard')
  // async getStudents(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) resp: Response,
  //   @Query() student_id : string
  // ) {
  //   const {
  //     query: { id },
  //     body: { user },
  //   } = req;
  //   const students = await this.userService.getStudents(req.query.student_id,{
  //     parentId: `${id}`,
  //     user,
  //   });

  //   if (students) {
  //     resp.json({
  //       message: userMessages.studentsFetchSuccess,
  //       status: HttpStatus.OK,
  //       [`student${id ? 's' : ''}`]: students,
  //     });
  //   } else {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: userErrors.getStudentsFailed,
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }

  @Get('students')
  @UseMiddleware('sessionGuard')
  async getStudents(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, students } = await this.userService.getStudents({
      studentId: `${id}`,
      user,
    });
    console.log(
      '🚀 ~ file: user.controller.ts:148 ~ UserController ~ students:',
      students,
    );

    if (students) {
      resp.json({
        message: userMessages.studentsFetchSuccess,
        status: HttpStatus.OK,
        [`student${id ? '' : 's'}`]: students,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: userErrors.getStudentsFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update-parent')
  @UseMiddleware('sessionGuard')
  async updateParent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    let { updatedParent, success }: BasicUpdateRes =
      await this.userService.updateParentProfile({
        ...req.body,
      });

    if (success) {
      updatedParent = await this.userService.formatPayload(
        updatedParent,
        UserTypes.PARENT,
      );

      resp.json({
        success,
        message: profileMessages.updatedSuccess,
        status: HttpStatus.OK,
        updatedParent,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: userErrors.updateFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Post('get-mock-test-result')
  // @UseMiddleware('sessionGuard')
  async getMockTestResult(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: mockTestResultReq,
  ) {
    const { success, addMockTestResult } =
      await this.userService.getMockTestResult(req.body);

    if (success) {
      resp.json({
        success,
        message: userMessages.createdResult,
        status: HttpStatus.CREATED,
        result: addMockTestResult,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: userErrors.createdResult,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Post('start-journey')
  @UseMiddleware('sessionGuard')
  async startLearningJourney(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: CreateLearningJourneyReq,
  ) {
    const { success, newJourney } = await this.userService.startLearningJourney(
      req.body,
    );

    resp.json({
      success,
      message: 'new user journey created',
      status: HttpStatus.CREATED,
      journey: newJourney,
    });
  }
}
