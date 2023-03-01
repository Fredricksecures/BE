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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Device } from 'src/modules/auth/entity/device.entity';
import { CountryList } from 'src/modules/utility/entity/countryList.entity';
import { AuthSeeder } from 'src/modules/auth/seeder/auth.seeder';
import {
  RegisterUserReq,
  BasicRegRes,
  LoginReq,
  LoginRes,
  ForgotPasswordReq,
  ForgotPasswordRes,
  ResetPasswordReq,
  ResetPasswordRes,
} from 'src/modules/auth/dto/auth.dto';
import {
  signUpReq,
  signInReq,
  SignInRes,
} from 'src/modules/auth/dto/socialLogin.dto';
import { authErrors, authMessages } from 'src/utils/messages';
import { Middleware } from 'src/utils/middleware';
import { UserTypes } from 'src/utils/enums';

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

  @Post('verify')
  async verify(
    @Res({ passthrough: true }) resp: Response,
    @Body() body: ForgotPasswordReq,
  ) {
    const session = await this.authService.verifyAccount(body);
    console.log(
      '🚀 ~ file: auth.controller.ts:135 ~ AuthController ~ session:',
      session,
    );

    resp.json({
      message: authMessages.verificationSuccess,
      status: HttpStatus.OK,
      success: true,
      session,
    });
  }

  @Post('resend-token')
  async resendOTP(
    @Res({ passthrough: true }) resp: Response,
    @Body() body: ForgotPasswordReq,
  ) {
    const token = await this.authService.resendToken(body);

    resp.json({
      message: authMessages.tokenResent,
      status: HttpStatus.OK,
      success: true,
      token,
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

  @Post('social-sign-up')
  async socialSignUp(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: signUpReq,
  ) {
    const { createdUser, success }: BasicRegRes =
      await this.authService.socialSignUp(body);

    if (success) {
      resp.json({
        success,
        message: authMessages.userCreated,
        status: HttpStatus.CREATED,
        createdUser,
      });
    }
  }

  @Post('social-sign-in')
  async socialSignIn(
    @Res({ passthrough: true }) resp: Response,
    @Body() body: signInReq,
  ) {
    let { success, user, session }: SignInRes =
      await this.authService.socialSignIn(body);

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
        status: HttpStatus.FOUND,
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
}
