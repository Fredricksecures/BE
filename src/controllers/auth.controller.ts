import {
  Body,
  Param,
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
  Req,
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
  UpdateParentReq,
  BasicUpdateRes,
  UpdateStudentReq,
} from 'src/dto/auth.dto';
import { authMessages, profileMessages } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private authSeeder: AuthSeeder,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
  ) {}

  @Get('endpoints')
  async serverStatus(@Res() resp: Response) {
    const endpoints = (global as any).app
      .getHttpServer()
      ._events.request._router.stack.map((item: any) => item.route?.path)
      .filter((item: string) => item);

    resp.json({
      status: HttpStatus.FOUND,
      // message: authMessages.endpoints,
      endpoints,
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
      resp.json({
        success,
        message: profileMessages.updatedFail,
        status: HttpStatus.BAD_REQUEST,
        user,
      });
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
      resp.json({
        success,
        message: profileMessages.updatedFail,
        status: HttpStatus.BAD_REQUEST,
        user,
      });
    }
  }
}
