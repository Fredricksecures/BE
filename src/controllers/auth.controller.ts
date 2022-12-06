import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { Device } from 'src/entities/device.entity';
import { Country } from 'src/entities/country.entity';
import { AuthSeeder } from 'src/seeders/auth.seeder';
import {
  RegisterUserReq,
  BasicRegRes,
  LoginReq,
  LoginRes,
  UpdateStudentReq,
  BasicUpdateRes,
  UpdateParentReq,
} from 'src/dto/auth.dto';
import { authErrors, authMessages, profileMessages } from 'src/constants';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { UserTypes } from 'src/enums';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private authSeeder: AuthSeeder,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
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
      user = await this.authService.formatPayload(user, UserTypes.PARENT);

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

  @Post('update-parent')
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

  @Post('update-student')
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
}
