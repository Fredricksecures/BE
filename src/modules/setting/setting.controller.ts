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

  @Patch('update-settings')
  @UseMiddleware('sessionGuard')
  async updateAccountNotification(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const {
      query: { id },
      body: { user },
    } = req;
    const { success, updatedAccountSettings } =
      await this.settingService.updateAccountSettings(
        {
          parentId: `${id}`,
          user,
        },
        req.body,
      );

    if (success) {
      resp.json({
        success,
        updatedAccountSettings,
        message: settingMessages.NotificationUpdated,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchSettings,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('get-settings-details')
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
    const { success, foundAccountSetings } =
      await this.settingService.getSettingsDetails({
        parentId: `${id}`,
        user,
      });

    if (success) {
      resp.json({
        success,
        foundAccountSetings,
        message: settingMessages.studentFetchedSuccess,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: settingErrors.failedToFetchSettings,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
