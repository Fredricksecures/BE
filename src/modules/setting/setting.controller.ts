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
  Query,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserService } from 'src/modules/user/user.service';
import { Student } from '../user/entity/student.entity';
import { SettingService } from 'src/modules/setting/setting.service';
@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly userService: UserService,
  ) {}

  @Middleware
  async sessionGuard(req, resp) {
    await this.userService.verifyToken(req, resp, {
      noTimeout: true,
      useCookies: true,
    });
  }
  //Profile
  @Get('get-students')
  @UseMiddleware('sessionGuard')
  async getStudents(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() student_id: string,
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, foundStudents } = await this.settingService.getStudents(
      req.query.student_id,
      {
        parentId: `${id}`,
        user,
      },
    );

    if (success) {
      resp.json({
        success,
        foundStudents,
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
  @UseMiddleware('sessionGuard')
  async updateStudentProfile(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('studentID') studentID,
  ) {
    const { success, updatedStudent } =
      await this.settingService.updateStudentProfile(studentID, req.body);

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

  @Post('create-student-profile')
  @UseMiddleware('sessionGuard')
  async createStudentProfile(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    console.log(user);
    const { success, studentCreated } =
      await this.settingService.createStudentProfile(req.body, {
        parentId: `${id}`,
        user,
      });
    if (success) {
      resp.json({
        success,
        studentCreated,
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

  //Security
  @Patch('update-setting-security')
  @UseMiddleware('sessionGuard')
  async updateAccountSecuirty(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, updatedSecurity } =
      await this.settingService.updateAccountSecuirty(req.body, {
        parentId: `${id}`,
        user,
      });

    if (success) {
      resp.json({
        success,
        updatedSecurity,
        message: settingMessages.securityUpdated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchSecurity,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-security')
  @UseMiddleware('sessionGuard')
  async getSecurityDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, foundAccountSecurity } =
      await this.settingService.getSecurityDetails({
        parentId: `${id}`,
        user,
      });
    if (success) {
      resp.json({
        success,
        foundAccountSecurity,
        message: settingMessages.securityFetchedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchSecurity,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //Display
  @Patch('update-setting-display')
  @UseMiddleware('sessionGuard')
  async updateAccountDisplay(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, updatedDisplay } =
      await this.settingService.updateAccountDisplay(req.body,{
        parentId: `${id}`,
        user,
      });

    if (success) {
      resp.json({
        success,
        updatedDisplay,
        message: settingMessages.securityUpdated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchDisplay,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-display')
  @UseMiddleware('sessionGuard')
  async getDisplayDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, foundAccountDisplay } =
      await this.settingService.getDisplayDetails({
        parentId: `${id}`,
        user,
      });

    if (success) {
      resp.json({
        success,
        foundAccountDisplay,
        message: settingMessages.displayFetchedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchDisplay,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //Notification
  @Patch('update-setting-Notification')
  @UseMiddleware('sessionGuard')
  async updateAccountNotification(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
   
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, updatedNotification } =
      await this.settingService.updateAccountNotification({
        parentId: `${id}`,
        user,
      }, req.body);

    if (success) {
      resp.json({
        success,
        updatedNotification,
        message: settingMessages.NotificationUpdated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchNotification,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-Notification')
  @UseMiddleware('sessionGuard')
  async getNotificationDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, foundAccountNotification } =
      await this.settingService.getNotificationDetails({
        parentId: `${id}`,
        user,
      });

    if (success) {
      resp.json({
        success,
        foundAccountNotification,
        message: settingMessages.NotificationFetchedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchNotification,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
