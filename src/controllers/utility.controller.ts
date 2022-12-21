import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UtilityService } from '../services/utility.service';
import { UtilitySeeder } from 'src/seeders/utlity.seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryList } from 'src/entities/countryList.entity';
import { Repository } from 'typeorm';
import { utlityMessages } from 'src/constants';
import { Device } from 'src/entities/device.entity';
import { Response, Request } from 'express';
import { LearningPackage } from './../entities/learningPackage.entity';

@Controller('utility')
export class UtilityController {
  constructor(
    private readonly utilitySeeder: UtilitySeeder,
    private readonly utilityService: UtilityService,
    @InjectRepository(CountryList) private countryRepo: Repository<CountryList>,
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(LearningPackage)
    private lPRepo: Repository<LearningPackage>,
  ) {}

  @Get('all-endpoints')
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

  @Get('countries')
  async getCountries(@Req() req: Request, @Res() resp: Response) {
    const { supported } = req.query;

    const countries = await this.countryRepo.find({
      ...(supported === 'true' ? { where: { supported: true } } : {}),
    });

    resp.json({
      status: HttpStatus.FOUND,
      message: utlityMessages.countries,
      countries,
    });
  }

  @Get('devices')
  async getDevices(@Req() req: Request, @Res() resp: Response) {
    const devices = await this.deviceRepo.find({});

    resp.json({
      status: HttpStatus.FOUND,
      message: utlityMessages.devices,
      devices,
    });
  }

  @Get('learning-packages')
  async getLPackages(@Req() req: Request, @Res() resp: Response) {
    const id = req.query.id;

    const learningPackages = await this.utilityService.getLearningPackages(
      `${id}`,
    );

    resp.json({
      status: HttpStatus.FOUND,
      message: utlityMessages.learningPackages,
      [`package${id ? '' : 's'}`]: learningPackages,
    });
  }
}
