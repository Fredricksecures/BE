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
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService,private readonly userService: UserService,) {}

  @Middleware
  async sessionGuard(req, resp) {
    await this.userService.verifyToken(req, resp, {
      noTimeout: true,
      useCookies: true,
    });
  }
  //Profile 
  @Get('get-students/:parentID')
  async getStudents(
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
  @UseMiddleware('sessionGuard')
  async updateStudentProfile(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('studentID') studentID,
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    console.log(user)
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
    console.log(user)
    const { success, studentCreated } =
      await this.settingService.createStudentProfile(req.body);

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
 @Patch('update-setting-security/:parentID')
 async updateAccountSecuirty(
   @Req() req: Request,
   @Res({ passthrough: true }) resp: Response,
   @Param('parentID') parentID,
 ) {
   const { success, updatedSecurity } =
     await this.settingService.updateAccountSecuirty(parentID,req.body);

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

 @Get('get-security/:parentID')
  async getSecurityDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('parentID') parentID,
  ) {
    const { success, foundAccountSecurity } =
      await this.settingService.getSecurityDetails(parentID);

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
  @Patch('update-setting-display/:parentID')
 async updateAccountDisplay(
   @Req() req: Request,
   @Res({ passthrough: true }) resp: Response,
   @Param('parentID') parentID,
 ) {
   const { success, updatedDisplay } =
     await this.settingService.updateAccountDisplay(parentID,req.body);

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

 @Get('get-display/:parentID')
  async getDisplayDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('parentID') parentID,
  ) {
    const { success, foundAccountDisplay } =
      await this.settingService.getDisplayDetails(parentID);

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
  @Patch('update-setting-Notification/:parentID')
 async updateAccountNotification(
   @Req() req: Request,
   @Res({ passthrough: true }) resp: Response,
   @Param('parentID') parentID,
 ) {
   const { success, updatedNotification } =
     await this.settingService.updateAccountNotification(parentID,req.body);

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

 @Get('get-Notification/:parentID')
  async getNotificationDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('parentID') parentID,
  ) {
    const { success, foundAccountNotification } =
      await this.settingService.getNotificationDetails(parentID);

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
