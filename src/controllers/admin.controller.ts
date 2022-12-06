import {
  Body,
  Query,
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
  Req,
  HttpException,
} from '@nestjs/common';
import {
  GetAllUsersSessionsReq,
  GetAllUsersSessionsRes,
} from 'src/dto/admin.dto';
import { AdminService } from '../services/admin.service';
import { Request, Response } from 'express';
import { adminErrors, adminMessages } from 'src/constants';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AdminService) {}

  @Get('user-sessions')
  async getUserSessions(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: GetAllUsersSessionsReq,
  ) {
    const { success, sessions }: GetAllUsersSessionsRes =
      await this.authService.getUserSessions(query);

    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.fetchSessionSuccess,
        sessions,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminErrors.fetchSessionFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('end-sessions')
  async endUserSessions(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Query() query: GetAllUsersSessionsReq,
  ) {
    const { success, sessions }: GetAllUsersSessionsRes =
      await this.authService.endUserSessions(query);
    if (success) {
      resp.json({
        status: HttpStatus.OK,
        message: adminMessages.fetchSessionSuccess,
        sessions,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: adminMessages.fetchSessionFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
