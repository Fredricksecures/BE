import { settingMessages, settingErrors } from './../../utils/messages';
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
} from '@nestjs/common';

import { Request, Response } from 'express';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserService } from 'src/modules/user/user.service';
import { Student } from '../user/entity/student.entity';
import { SettingService } from 'src/modules/setting/setting.service';
@Controller('store')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}
  @Get('get-students/:parentID')
  async getstudents(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('parentID') parentID,
  ) {
    const { success, foundStudent } =
      await this.settingService.getStudents(parentID);

    if (success) {
      resp.json({
        success,
        foundStudent,
        message: settingMessages.studentFetchedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchStudent,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  
  @Patch('update-student-profile/:studentID')
  async updateStudentProfile(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('studentID') studentID,
  ) {
    const { success, updatedStudent } =
      await this.settingService.updateStudentProfile(studentID,req.body);

    if (success) {
      resp.json({
        success,
        updatedStudent,
        message: settingMessages.studentUpdated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchStudent,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // @Post('create-student-profile')
  // async updateStudentProfile(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) resp: Response,
  //   @Param('studentID') studentID,
  // ) {
  //   const { success, updatedStudent } =
  //     await this.settingService.updateStudentProfile(studentID,req.body);

  //   if (success) {
  //     resp.json({
  //       success,
  //       updatedStudent,
  //       message: settingMessages.studentUpdated,
  //       status: HttpStatus.OK,
  //     });
  //   } else {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: settingErrors.failedToFetchStudent,
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
 // }
 
}
