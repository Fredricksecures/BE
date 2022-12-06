import {
  Body,
  Param,
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private authSeeder: AuthSeeder,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
  ) {}

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
    const { success, user }: LoginRes = await this.authService.login(body);

    console.log(user);

    if (success) {
      // resp.cookie('jwt', token, { httpOnly: true });

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
  async updateParent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: UpdateParentReq,
  ) {
    const { user, success }: BasicUpdateRes =
      await this.authService.updateParentProfile(body);
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

  @Post('update-student')
  async updateStudent(
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
    @Body() body: UpdateStudentReq,
  ) {
    const { user, success }: BasicUpdateRes =
      await this.authService.updateStudentProfile(body);
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
