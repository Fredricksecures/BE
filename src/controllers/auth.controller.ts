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
import { AuthService } from '../services/auth.service';
import { Device } from 'src/entities/device.entity';
import { CountryList } from 'src/entities/countryList.entity';
import { AuthSeeder } from 'src/seeders/auth.seeder';
import {
  RegisterUserReq,
  BasicRegRes,
  LoginReq,
  LoginRes,
  UpdateStudentReq,
  BasicUpdateRes,
  ForgotPasswordReq,
  ForgotPasswordRes,
  ResetPasswordReq,
  ResetPasswordRes,
  CreateStudentReq,
} from 'src/dto/auth.dto';
import { authErrors, authMessages, profileMessages } from 'src/utils/messages';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserTypes } from 'src/utils/enums';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private authSeeder: AuthSeeder,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(CountryList) private countryRepo: Repository<CountryList>,
  ) {}

  @Middleware
  async sessionGuard(req, resp) {
    await this.authService.verifyToken(req, resp, {
      noTimeout: true,
      useCookies: true,
    });
  }

  @Post('register')
  async basicRegistrationCtlr(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: RegisterUserReq,
  ) {
    const { createdUser, success }: BasicRegRes =
      await this.authService.registerUser(body);

    if (success) {
      resp.json({
        success,
        message: authMessages.userCreated,
        status: HttpStatus.CREATED,
        createdUser,
      });
    }
  }

  @Post('login')
  async loginCtlr(
    @Res({ passthrough: true }) resp: Response,
    @Body() body: LoginReq,
  ) {
    let { success, user, session }: LoginRes = await this.authService.login(
      body,
    );

    if (success) {
      user = await this.authService.formatPayload(user, UserTypes.DEFAULT);

      //* add new session to user response payload
      user = {
        ...user,
        parent: {
          ...user.parent,
          session,
        },
      };
      resp.cookie('jwt', user.parent.session.token, { httpOnly: true });

      resp.json({
        success,
        status: HttpStatus.CREATED,
        message: authMessages.login,
        user,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.loginFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('forgot-password')
  async forgotPasswordCtlr(
    @Res({ passthrough: true }) resp: Response,
    @Body() body: ForgotPasswordReq,
  ) {
    const { resetPin }: ForgotPasswordRes =
      await this.authService.forgotPassword(body);

    resp.json({
      message: authMessages.passwordEmailSent,
      status: HttpStatus.OK,
      success: true,
      resetPin,
    });
  }

  @Post('reset-password')
  async resetPasswordCtlr(
    @Res({ passthrough: true }) resp: Response,
    @Body() body: ResetPasswordReq,
  ) {
    const { success }: ResetPasswordRes = await this.authService.resetPassword(
      body,
    );

    resp.json({
      status: HttpStatus.OK,
      message: authMessages.pwordReset,
      success,
    });
  }

  @Patch('update-parent')
  @UseMiddleware('sessionGuard')
  async updateParent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    let { updatedParent, success }: BasicUpdateRes =
      await this.authService.updateParentProfile({
        ...req.body,
      });

    if (success) {
      updatedParent = await this.authService.formatPayload(
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
          error: authErrors.updateFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('create-students')
  @UseMiddleware('sessionGuard')
  async createStudent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: CreateStudentReq,
  ) {
    const { success, createdStudents } =
      await this.authService.createStudentProfile(req.body);

    if (success) {
      resp.json({
        success,
        message: authMessages.createdStudent,
        status: HttpStatus.CREATED,
        students: createdStudents,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.updateFailed,
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
    const { user, success } = await this.authService.updateStudentProfile(body);

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
          error: authErrors.updateFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

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

    const students = await this.authService.getStudents({
      studentId: `${id}`,
      user,
    });

    if (students) {
      resp.json({
        message: authMessages.studentsFetchSuccess,
        status: HttpStatus.OK,
        [`student${id ? 's' : ''}`]: students,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.getStudentsFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('logout/:all?')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Param('all') all: any,
  ) {
    const { success } = await this.authService.logout(all, req.cookies.jwt);

    if (success) {
      resp.json({
        success,
        message: authMessages.logout,
        status: HttpStatus.OK,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: authErrors.logoutFailed,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
